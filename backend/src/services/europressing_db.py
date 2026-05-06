"""DB abstraction for europressing data access.

Defines a Protocol with two implementations:
- SupabaseDB: reads/writes via PostgREST (Supabase)
- SqliteDB: reads/writes a local SQLite file

All methods return normalized Python dicts (flattened politician info, bool not 0/1).
"""

from __future__ import annotations

import sqlite3
from datetime import datetime
from pathlib import Path
from typing import Protocol

from src.settings import settings


class EuropressingDB(Protocol):
    def get_all_affairs(self) -> list[dict]: ...
    def get_affair(self, affair_id: str) -> dict | None: ...
    def get_article_counts(self) -> dict[str, int]: ...
    def get_labeled_counts(self) -> dict[str, int]: ...
    def get_category_counts(self) -> dict[str, dict[str, int]]: ...
    def get_articles_for_affair(self, affair_id: str) -> list[dict]: ...
    def get_scores_for_affair(self, affair_id: str) -> dict[str, dict]: ...
    def save_judgment(
        self,
        article_id: str,
        affair_id: str,
        manual_judgment: bool | None,
        notes: str | None,
    ) -> None: ...


# ── Supabase implementation ──────────────────────────────────────────────────


class SupabaseDB:
    @staticmethod
    def _fetch_all_rows(query_builder) -> list[dict]:
        page_size = 1000
        offset = 0
        all_rows: list[dict] = []
        while True:
            resp = query_builder.range(offset, offset + page_size - 1).execute()
            rows = resp.data or []
            all_rows.extend(rows)
            if len(rows) < page_size:
                break
            offset += page_size
        return all_rows

    def _supabase(self):
        from src.supabase_client import get_supabase

        return get_supabase()

    def get_all_affairs(self) -> list[dict]:
        resp = (
            self._supabase()
            .table("ep_affairs")
            .select("*, ep_politicians(*)")
            .order("date_start", desc=True)
            .execute()
        )
        result = []
        for row in resp.data or []:
            politician = row.pop("ep_politicians", None) or {}
            row["politician_name"] = politician.get("name")
            row["politician_party"] = politician.get("party_name")
            result.append(row)
        return result

    def get_affair(self, affair_id: str) -> dict | None:
        resp = (
            self._supabase()
            .table("ep_affairs")
            .select("*, ep_politicians(*)")
            .eq("affair_id", affair_id)
            .single()
            .execute()
        )
        row = resp.data
        if not row:
            return None
        politician = row.pop("ep_politicians", None) or {}
        row["politician_name"] = politician.get("name")
        row["politician_party"] = politician.get("party_name")
        return row

    def get_article_counts(self) -> dict[str, int]:
        rows = self._fetch_all_rows(
            self._supabase().table("ep_article_affairs").select("affair_id")
        )
        counts: dict[str, int] = {}
        for row in rows:
            aid = row["affair_id"]
            counts[aid] = counts.get(aid, 0) + 1
        return counts

    def get_labeled_counts(self) -> dict[str, int]:
        rows = self._fetch_all_rows(
            self._supabase()
            .table("ep_relevance_scores")
            .select("affair_id")
            .not_.is_("manual_judgment", "null")
        )
        counts: dict[str, int] = {}
        for row in rows:
            aid = row["affair_id"]
            counts[aid] = counts.get(aid, 0) + 1
        return counts

    def get_category_counts(self) -> dict[str, dict[str, int]]:
        rows = self._fetch_all_rows(
            self._supabase()
            .table("ep_relevance_scores")
            .select("affair_id,relevance_category")
        )
        counts: dict[str, dict[str, int]] = {}
        for row in rows:
            aid = row["affair_id"]
            cat = (row.get("relevance_category") or "").upper()
            if aid not in counts:
                counts[aid] = {}
            counts[aid][cat] = counts[aid].get(cat, 0) + 1
        return counts

    def get_articles_for_affair(self, affair_id: str) -> list[dict]:
        ac_resp = (
            self._supabase()
            .table("ep_article_affairs")
            .select("doc_key")
            .eq("affair_id", affair_id)
            .execute()
        )
        doc_keys = [r["doc_key"] for r in ac_resp.data or []]
        if not doc_keys:
            return []
        resp = (
            self._supabase()
            .table("ep_articles")
            .select("*")
            .in_("doc_key", doc_keys)
            .execute()
        )
        return resp.data or []

    def get_scores_for_affair(self, affair_id: str) -> dict[str, dict]:
        resp = (
            self._supabase()
            .table("ep_relevance_scores")
            .select("*")
            .eq("affair_id", affair_id)
            .execute()
        )
        return {row["doc_key"]: row for row in resp.data or []}

    def save_judgment(
        self,
        article_id: str,
        affair_id: str,
        manual_judgment: bool | None,
        notes: str | None,
    ) -> None:
        self._supabase().table("ep_relevance_scores").update(
            {
                "manual_judgment": manual_judgment,
                "notes": notes,
                "reviewed_by": "admin",
                "reviewed_at": datetime.utcnow().isoformat(),
            }
        ).eq("doc_key", article_id).eq("affair_id", affair_id).execute()


# ── SQLite implementation ─────────────────────────────────────────────────────


class SqliteDB:
    def _connect(self, readonly: bool = True) -> sqlite3.Connection:
        db_path = Path(settings.europressing_sqlite_path)
        uri = f"file:{db_path}{'?mode=ro' if readonly else ''}"
        conn = sqlite3.connect(uri, uri=True)
        conn.row_factory = sqlite3.Row
        return conn

    def get_all_affairs(self) -> list[dict]:
        conn = self._connect()
        rows = conn.execute(
            """
            SELECT a.*, p.name AS politician_name, p.party_name AS politician_party
            FROM affairs a
            LEFT JOIN politicians p ON a.politician_id = p.poligraph_id
            ORDER BY a.date_start DESC
            """
        ).fetchall()
        conn.close()
        return [dict(r) for r in rows]

    def get_affair(self, affair_id: str) -> dict | None:
        conn = self._connect()
        row = conn.execute(
            """
            SELECT a.*, p.name AS politician_name, p.party_name AS politician_party
            FROM affairs a
            LEFT JOIN politicians p ON a.politician_id = p.poligraph_id
            WHERE a.affair_id = ?
            """,
            (affair_id,),
        ).fetchone()
        conn.close()
        if not row:
            return None
        d = dict(row)
        # SQLite stores booleans as 0/1
        if d.get("prison_suspended") is not None:
            d["prison_suspended"] = bool(d["prison_suspended"])
        return d

    def get_article_counts(self) -> dict[str, int]:
        conn = self._connect()
        rows = conn.execute(
            "SELECT affair_id, COUNT(*) AS cnt FROM article_affairs GROUP BY affair_id"
        ).fetchall()
        conn.close()
        return {r["affair_id"]: r["cnt"] for r in rows}

    def get_labeled_counts(self) -> dict[str, int]:
        conn = self._connect()
        rows = conn.execute(
            "SELECT affair_id, COUNT(*) AS cnt FROM relevance_scores "
            "WHERE manual_judgment IS NOT NULL GROUP BY affair_id"
        ).fetchall()
        conn.close()
        return {r["affair_id"]: r["cnt"] for r in rows}

    def get_category_counts(self) -> dict[str, dict[str, int]]:
        conn = self._connect()
        rows = conn.execute(
            "SELECT affair_id, UPPER(relevance_category) AS cat, COUNT(*) AS cnt "
            "FROM relevance_scores GROUP BY affair_id, cat"
        ).fetchall()
        conn.close()
        counts: dict[str, dict[str, int]] = {}
        for r in rows:
            aid = r["affair_id"]
            if aid not in counts:
                counts[aid] = {}
            counts[aid][r["cat"] or ""] = r["cnt"]
        return counts

    def get_articles_for_affair(self, affair_id: str) -> list[dict]:
        conn = self._connect()
        rows = conn.execute(
            """
            SELECT art.*
            FROM articles art
            JOIN article_affairs aa ON art.doc_key = aa.doc_key
            WHERE aa.affair_id = ?
            """,
            (affair_id,),
        ).fetchall()
        conn.close()
        return [dict(r) for r in rows]

    def get_scores_for_affair(self, affair_id: str) -> dict[str, dict]:
        conn = self._connect()
        rows = conn.execute(
            "SELECT * FROM relevance_scores WHERE affair_id = ?",
            (affair_id,),
        ).fetchall()
        conn.close()
        result = {}
        for r in rows:
            d = dict(r)
            # SQLite stores booleans as 0/1
            if d.get("manual_judgment") is not None:
                d["manual_judgment"] = bool(d["manual_judgment"])
            result[d["doc_key"]] = d
        return result

    def save_judgment(
        self,
        article_id: str,
        affair_id: str,
        manual_judgment: bool | None,
        notes: str | None,
    ) -> None:
        conn = self._connect(readonly=False)
        manual_val = None if manual_judgment is None else (1 if manual_judgment else 0)
        conn.execute(
            """
            UPDATE relevance_scores
            SET manual_judgment = ?,
                notes = ?,
                reviewed_by = 'admin',
                reviewed_at = ?
            WHERE doc_key = ? AND affair_id = ?
            """,
            (manual_val, notes, datetime.utcnow().isoformat(), article_id, affair_id),
        )
        conn.commit()
        conn.close()


# ── Factory ───────────────────────────────────────────────────────────────────


def get_db() -> EuropressingDB:
    if settings.offline_mode:
        return SqliteDB()
    return SupabaseDB()
