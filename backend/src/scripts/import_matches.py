"""Import survey-vote matches from the validated CSV into Supabase.

Usage:
    cd backend && uv run python -m src.scripts.import_matches [path_or_url]

If no argument is given, fetches from the GitHub raw URL.
You can also pass a local file path.
"""

import csv
import hashlib
import io
import sys
from pathlib import Path
from urllib.request import urlopen

from loguru import logger

from src.supabase_client import get_supabase

GITHUB_CSV_URL = "https://raw.githubusercontent.com/dawtasso/eu_survey_correlation/refs/heads/main/data/matches/simplified_michlou_survey_vote_matches_clean.csv"

BATCH_SIZE = 200

SEPARATOR = "::"


def make_match_id(question_id: str, survey_file: str, procedure_reference: str) -> str:
    """Deterministic match_id: first 16 chars of sha256 hex digest."""
    key = f"{question_id}{SEPARATOR}{survey_file}{SEPARATOR}{procedure_reference}"
    return hashlib.sha256(key.encode("utf-8")).hexdigest()[:16]


def make_match_key(question_id: str, survey_file: str, procedure_reference: str) -> str:
    """Human-readable match key."""
    return f"{question_id}{SEPARATOR}{survey_file}{SEPARATOR}{procedure_reference}"


def parse_bool(val: str) -> bool | None:
    if val == "" or val is None:
        return None
    return val.strip().lower() in ("true", "1", "yes")


def parse_int(val: str) -> int | None:
    if val == "" or val is None:
        return None
    try:
        return int(float(val))
    except (ValueError, TypeError):
        return None


def parse_float(val: str) -> float | None:
    if val == "" or val is None:
        return None
    try:
        return float(val)
    except (ValueError, TypeError):
        return None


def _open_csv(source: str) -> io.StringIO | io.TextIOWrapper:
    """Open a CSV from a URL or local path, return a file-like object."""
    if source.startswith("http"):
        logger.info(f"Downloading CSV from {source}")
        with urlopen(source) as resp:
            data = resp.read().decode("utf-8")
        return io.StringIO(data)
    path = Path(source)
    if not path.exists():
        raise FileNotFoundError(f"CSV not found at {path}")
    return open(path, newline="", encoding="utf-8")


def import_csv(source: str) -> None:
    logger.info(f"Importing from {source}")
    supabase = get_supabase()

    # Fetch existing validated match_ids so we don't overwrite them
    existing_resp = (
        supabase.table("survey_vote_matches")
        .select("match_id, admin_validated")
        .not_.is_("admin_validated", "null")
        .execute()
    )
    validated_ids = {r["match_id"] for r in existing_resp.data}
    logger.info(f"Found {len(validated_ids)} already-validated matches (will skip)")

    rows: list[dict] = []
    skipped = 0
    with _open_csv(source) as f:
        reader = csv.DictReader(f)
        for row in reader:
            question_id = row["sheet_id"].strip()
            survey_file = row.get("file_name", "").strip()
            procedure_reference = row.get("procedure_reference", "").strip()
            vote_id_raw = parse_int(row["vote_id"])

            if not procedure_reference:
                logger.warning(
                    f"Skipping row without procedure_reference: "
                    f"question_id={question_id}, vote_id={vote_id_raw}"
                )
                continue

            match_id = make_match_id(question_id, survey_file, procedure_reference)
            match_key = make_match_key(question_id, survey_file, procedure_reference)

            # Skip rows that already have admin validation
            if match_id in validated_ids:
                skipped += 1
                continue

            rows.append(
                {
                    "match_id": match_id,
                    "match_key": match_key,
                    "question_id": question_id,
                    "question_clean": row.get("question_clean", "").strip(),
                    "question_original": row.get("question_en", "").strip(),
                    "survey_file": survey_file,
                    "survey_date": row.get("survey_date", "").strip() or None,
                    "vote_id": vote_id_raw,
                    "procedure_reference": procedure_reference,
                    "vote_summary_original": row.get("summary", "").strip(),
                    "vote_summary_clean": row.get("summary_clean", "").strip(),
                    "vote_date": row.get("vote_date", "").strip() or None,
                    "days_between": parse_int(row.get("time_delta", "")),
                    "similarity_score": parse_float(
                        row.get("similarity_score", "")
                    ),
                    "llm_related": parse_bool(""),
                    "llm_explanation": None,
                    "source": "Eurobarometer",
                    "admin_validated": None,
                }
            )

    logger.info(
        f"Parsed {len(rows)} new rows ({skipped} skipped as already validated), "
        f"inserting in batches of {BATCH_SIZE}..."
    )

    for start in range(0, len(rows), BATCH_SIZE):
        batch = rows[start : start + BATCH_SIZE]
        supabase.table("survey_vote_matches").upsert(
            batch, on_conflict="match_id"
        ).execute()
        logger.info(f"  Upserted rows {start}–{start + len(batch) - 1}")

    logger.info(f"Done. {len(rows)} matches imported ({skipped} validated skipped).")


if __name__ == "__main__":
    source = sys.argv[1] if len(sys.argv) > 1 else GITHUB_CSV_URL
    import_csv(source)
