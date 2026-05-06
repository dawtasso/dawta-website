"""Bidirectional LWW sync for relevance_scores between local SQLite and Supabase.

Ensures both data stores converge: labels created on the website (Supabase) are
pulled into SQLite, and scores computed locally (SQLite) are pushed to Supabase.

Conflict resolution uses Last-Writer-Wins (LWW) on two independent field groups:
  - Manual fields  (manual_judgment, reviewed_by, reviewed_at, notes)  → keyed on reviewed_at
  - Computed fields (relevance_score, relevance_category, …, evaluated_at) → keyed on evaluated_at

Usage:
    cd backend && uv run python -m src.scripts.sync_relevance_scores              # full sync
    cd backend && uv run python -m src.scripts.sync_relevance_scores --dry-run    # preview only
"""

import argparse
import sqlite3
import sys
from datetime import datetime, timezone
from pathlib import Path

from loguru import logger

from src.settings import settings
from src.supabase_client import get_supabase

# ---------------------------------------------------------------------------
# Constants (aligned with europressing/scripts/database/sync_database_to_supabase.py)
# ---------------------------------------------------------------------------

SUPABASE_TABLE = "ep_relevance_scores"
CONFLICT_KEYS = "doc_key,affair_id"
NATURAL_KEY = ("doc_key", "affair_id")

MANUAL_FIELDS = ("manual_judgment", "reviewed_by", "reviewed_at", "notes")
COMPUTED_FIELDS = (
    "relevance_score",
    "relevance_category",
    "affair_name_found",
    "keyword_overlap_score",
    "matched_keywords",
    "semantic_score",
    "evaluated_at",
)

BOOL_COLUMNS = {"affair_name_found", "manual_judgment"}

# Columns present in SQLite but not in Supabase
DROP_COLUMNS_FOR_SUPABASE = {"id"}

SUPABASE_PAGE_SIZE = 1000
SUPABASE_BATCH_SIZE = 200
SQLITE_BATCH_SIZE = 500

ALL_DATA_COLUMNS = (
    "doc_key",
    "affair_id",
    "affair_name_found",
    "keyword_overlap_score",
    "matched_keywords",
    "semantic_score",
    "relevance_score",
    "relevance_category",
    "manual_judgment",
    "reviewed_by",
    "reviewed_at",
    "notes",
    "evaluated_at",
)

# ---------------------------------------------------------------------------
# Timestamp helpers
# ---------------------------------------------------------------------------


def parse_timestamp(value) -> datetime | None:
    """Parse a timestamp from either SQLite or Supabase format into an aware datetime."""
    if value is None:
        return None
    if isinstance(value, datetime):
        if value.tzinfo is None:
            return value.replace(tzinfo=timezone.utc)
        return value
    s = str(value).strip()
    if not s:
        return None
    # Try ISO 8601 with timezone (Supabase: "2026-05-03T16:31:32+00:00")
    for fmt in (
        "%Y-%m-%dT%H:%M:%S.%f",
        "%Y-%m-%dT%H:%M:%S%z",
        "%Y-%m-%dT%H:%M:%S.%f%z",
        "%Y-%m-%d %H:%M:%S",
        "%Y-%m-%dT%H:%M:%S",
        "%Y-%m-%d %H:%M:%S.%f",
    ):
        try:
            dt = datetime.strptime(s, fmt)
            if dt.tzinfo is None:
                dt = dt.replace(tzinfo=timezone.utc)
            return dt
        except ValueError:
            continue
    logger.warning(f"Could not parse timestamp: {value!r}")
    return None


# ---------------------------------------------------------------------------
# Boolean helpers
# ---------------------------------------------------------------------------


def bool_to_sqlite(value) -> int | None:
    """Convert a Python/Supabase boolean to SQLite 0/1."""
    if value is None:
        return None
    return 1 if value else 0


def bool_to_supabase(value) -> bool | None:
    """Convert a SQLite 0/1 to Python bool for Supabase."""
    if value is None:
        return None
    return bool(value)


def _normalize(value):
    """Normalize a value for comparison across SQLite and Supabase representations.

    Handles: bool/int equivalence, timestamp format differences, float precision, None/empty.
    """
    if value is None:
        return None
    if isinstance(value, bool):
        return value
    if isinstance(value, int):
        return value
    if isinstance(value, float):
        return round(value, 10)
    s = str(value).strip()
    if not s:
        return None
    # Only attempt timestamp parsing for date-like strings (e.g. "2026-05-03 ...")
    if len(s) >= 10 and s[4:5] == "-" and s[7:8] == "-":
        dt = parse_timestamp(s)
        if dt is not None:
            return dt
    return s


# ---------------------------------------------------------------------------
# Data source helpers
# ---------------------------------------------------------------------------


def open_sqlite(db_path: Path) -> sqlite3.Connection:
    """Open SQLite in read-write mode."""
    if not db_path.exists():
        logger.error(f"SQLite database not found: {db_path}")
        sys.exit(1)
    conn = sqlite3.connect(str(db_path))
    conn.row_factory = sqlite3.Row
    return conn


def fetch_sqlite_rows(conn: sqlite3.Connection) -> dict[tuple, dict]:
    """Fetch all relevance_scores from SQLite, keyed by (doc_key, affair_id)."""
    cursor = conn.execute("SELECT * FROM relevance_scores")
    rows = {}
    for row in cursor.fetchall():
        d = dict(row)
        key = (d["doc_key"], d["affair_id"])
        rows[key] = d
    logger.info(f"SQLite: {len(rows)} rows")
    return rows


def fetch_supabase_rows(supabase) -> dict[tuple, dict]:
    """Fetch all ep_relevance_scores from Supabase (paginated), keyed by (doc_key, affair_id)."""
    all_rows: list[dict] = []
    offset = 0
    while True:
        resp = (
            supabase.table(SUPABASE_TABLE)
            .select("*")
            .range(offset, offset + SUPABASE_PAGE_SIZE - 1)
            .execute()
        )
        if not resp.data:
            break
        all_rows.extend(resp.data)
        if len(resp.data) < SUPABASE_PAGE_SIZE:
            break
        offset += SUPABASE_PAGE_SIZE

    rows = {}
    for row in all_rows:
        key = (row["doc_key"], row["affair_id"])
        rows[key] = row
    logger.info(f"Supabase: {len(rows)} rows")
    return rows


# ---------------------------------------------------------------------------
# Merge logic
# ---------------------------------------------------------------------------


def pick_manual_winner(sqlite_row: dict, supa_row: dict) -> str | None:
    """Return 'sqlite', 'supabase', or None if neither has manual annotation."""
    ts_sq = parse_timestamp(sqlite_row.get("reviewed_at"))
    ts_su = parse_timestamp(supa_row.get("reviewed_at"))

    if ts_sq is None and ts_su is None:
        return None
    if ts_sq is not None and ts_su is None:
        return "sqlite"
    if ts_sq is None and ts_su is not None:
        return "supabase"
    # Both have timestamps — newer wins, SQLite wins ties
    if ts_sq >= ts_su:
        return "sqlite"
    return "supabase"


def pick_computed_winner(sqlite_row: dict, supa_row: dict) -> str | None:
    """Return 'sqlite', 'supabase', or None if neither has evaluated_at."""
    ts_sq = parse_timestamp(sqlite_row.get("evaluated_at"))
    ts_su = parse_timestamp(supa_row.get("evaluated_at"))

    if ts_sq is None and ts_su is None:
        return None
    if ts_sq is not None and ts_su is None:
        return "sqlite"
    if ts_sq is None and ts_su is not None:
        return "supabase"
    if ts_sq >= ts_su:
        return "sqlite"
    return "supabase"


def row_for_supabase(row: dict) -> dict:
    """Prepare a row dict for Supabase: drop id, convert booleans."""
    out = {k: v for k, v in row.items() if k not in DROP_COLUMNS_FOR_SUPABASE}
    for col in BOOL_COLUMNS:
        if col in out:
            out[col] = bool_to_supabase(out[col])
    return out


def row_for_sqlite(row: dict) -> dict:
    """Prepare a row dict for SQLite: convert booleans to 0/1."""
    out = {k: v for k, v in row.items() if k in ALL_DATA_COLUMNS}
    for col in BOOL_COLUMNS:
        if col in out:
            out[col] = bool_to_sqlite(out[col])
    return out


# ---------------------------------------------------------------------------
# Write helpers
# ---------------------------------------------------------------------------


def upsert_supabase_batch(supabase, rows: list[dict]) -> None:
    """Upsert a batch of rows to Supabase."""
    supabase.table(SUPABASE_TABLE).upsert(rows, on_conflict=CONFLICT_KEYS).execute()


def upsert_sqlite_batch(conn: sqlite3.Connection, rows: list[dict]) -> None:
    """Upsert a batch of rows into SQLite using INSERT OR REPLACE."""
    if not rows:
        return
    columns = list(ALL_DATA_COLUMNS)
    placeholders = ", ".join(["?"] * len(columns))
    col_names = ", ".join(columns)
    sql = (
        f"INSERT OR REPLACE INTO relevance_scores ({col_names}) VALUES ({placeholders})"
    )
    for row in rows:
        values = [row.get(c) for c in columns]
        conn.execute(sql, values)


# ---------------------------------------------------------------------------
# Main sync
# ---------------------------------------------------------------------------


def sync(*, dry_run: bool = False) -> None:
    db_path = Path(settings.europressing_sqlite_path)
    logger.info(f"SQLite path: {db_path}")

    conn = open_sqlite(db_path)
    supabase = get_supabase()

    sqlite_rows = fetch_sqlite_rows(conn)
    supa_rows = fetch_supabase_rows(supabase)

    all_keys = set(sqlite_rows.keys()) | set(supa_rows.keys())
    logger.info(f"Unique keys across both sources: {len(all_keys)}")

    # Action buckets
    insert_to_supabase: list[dict] = []
    insert_to_sqlite: list[dict] = []
    update_supabase: list[dict] = []
    update_sqlite: list[dict] = []
    unchanged = 0

    for key in all_keys:
        in_sqlite = key in sqlite_rows
        in_supa = key in supa_rows

        # --- SQLite-only: push to Supabase ---
        if in_sqlite and not in_supa:
            insert_to_supabase.append(row_for_supabase(sqlite_rows[key]))
            continue

        # --- Supabase-only: pull to SQLite ---
        if not in_sqlite and in_supa:
            insert_to_sqlite.append(row_for_sqlite(supa_rows[key]))
            continue

        # --- Both exist: LWW merge ---
        sq = sqlite_rows[key]
        su = supa_rows[key]

        supa_updates: dict = {}
        sqlite_updates: dict = {}

        # Manual fields
        manual_winner = pick_manual_winner(sq, su)
        if manual_winner == "sqlite":
            for f in MANUAL_FIELDS:
                val = sq.get(f)
                supa_val = bool_to_supabase(val) if f in BOOL_COLUMNS else val
                if _normalize(supa_val) != _normalize(su.get(f)):
                    supa_updates[f] = supa_val
        elif manual_winner == "supabase":
            for f in MANUAL_FIELDS:
                val = su.get(f)
                sq_val = bool_to_sqlite(val) if f in BOOL_COLUMNS else val
                if _normalize(sq_val) != _normalize(sq.get(f)):
                    sqlite_updates[f] = sq_val

        # Computed fields
        computed_winner = pick_computed_winner(sq, su)
        if computed_winner == "sqlite":
            for f in COMPUTED_FIELDS:
                val = sq.get(f)
                supa_val = bool_to_supabase(val) if f in BOOL_COLUMNS else val
                if _normalize(supa_val) != _normalize(su.get(f)):
                    supa_updates[f] = supa_val
        elif computed_winner == "supabase":
            for f in COMPUTED_FIELDS:
                val = su.get(f)
                sq_val = bool_to_sqlite(val) if f in BOOL_COLUMNS else val
                if _normalize(sq_val) != _normalize(sq.get(f)):
                    sqlite_updates[f] = sq_val

        if supa_updates:
            # Build a full row so upsert never sends NULLs for NOT NULL columns
            merged = dict(su)
            merged.update(supa_updates)
            update_supabase.append(row_for_supabase(merged))
        if sqlite_updates:
            # Build a full row for INSERT OR REPLACE (SQLite needs all columns)
            merged = dict(sq)
            merged.update(sqlite_updates)
            update_sqlite.append(row_for_sqlite(merged))

        if not supa_updates and not sqlite_updates:
            unchanged += 1

    # --- Summary ---
    logger.info("--- Sync summary ---")
    logger.info(f"  Insert to Supabase : {len(insert_to_supabase)}")
    logger.info(f"  Insert to SQLite   : {len(insert_to_sqlite)}")
    logger.info(f"  Update Supabase    : {len(update_supabase)}")
    logger.info(f"  Update SQLite      : {len(update_sqlite)}")
    logger.info(f"  Unchanged          : {unchanged}")

    if dry_run:
        logger.info("Dry run — no writes performed.")
        conn.close()
        return

    # --- Write to Supabase ---
    all_supa_writes = insert_to_supabase + update_supabase
    if all_supa_writes:
        logger.info(f"Upserting {len(all_supa_writes)} rows to Supabase...")
        for i in range(0, len(all_supa_writes), SUPABASE_BATCH_SIZE):
            batch = all_supa_writes[i : i + SUPABASE_BATCH_SIZE]
            upsert_supabase_batch(supabase, batch)
            logger.debug(
                f"  Supabase batch {i // SUPABASE_BATCH_SIZE + 1} ({len(batch)} rows)"
            )

    # --- Write to SQLite ---
    all_sqlite_writes = insert_to_sqlite + update_sqlite
    if all_sqlite_writes:
        logger.info(f"Upserting {len(all_sqlite_writes)} rows to SQLite...")
        for i in range(0, len(all_sqlite_writes), SQLITE_BATCH_SIZE):
            batch = all_sqlite_writes[i : i + SQLITE_BATCH_SIZE]
            upsert_sqlite_batch(conn, batch)
            logger.debug(
                f"  SQLite batch {i // SQLITE_BATCH_SIZE + 1} ({len(batch)} rows)"
            )
        conn.commit()

    conn.close()
    logger.info("Sync complete.")


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------


def main():
    parser = argparse.ArgumentParser(
        description="Bidirectional LWW sync for relevance_scores (SQLite <-> Supabase)"
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Preview changes without writing to either data store",
    )
    args = parser.parse_args()

    sync(dry_run=args.dry_run)


if __name__ == "__main__":
    main()
