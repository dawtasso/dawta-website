"""Import survey-vote matches from the validated CSV into Supabase.

Usage:
    cd backend && uv run python -m src.scripts.import_matches [path_or_url]

If no argument is given, fetches from the GitHub raw URL.
You can also pass a local file path.
"""

import csv
import io
import sys
from pathlib import Path
from urllib.request import urlopen

from loguru import logger

from src.supabase_client import get_supabase

GITHUB_CSV_URL = (
    "https://raw.githubusercontent.com/dawtasso/eu_survey_correlation"
    "/main/data/matches/survey_vote_matches_validated.csv"
)

BATCH_SIZE = 200


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

    # First, clear existing data
    logger.info("Deleting existing rows from survey_vote_matches...")
    supabase.table("survey_vote_matches").delete().neq("match_id", "").execute()

    rows: list[dict] = []
    with _open_csv(source) as f:
        reader = csv.DictReader(f)
        for i, row in enumerate(reader):
            question_id = row["question_id"].strip()
            vote_id_raw = parse_int(row["vote_id"])
            match_id = f"{question_id}_{vote_id_raw or 0}_{i}"

            rows.append({
                "match_id": match_id,
                "question_id": question_id,
                "question_clean": row.get("question_clean", "").strip(),
                "question_original": row.get("question_original", "").strip(),
                "survey_file": row.get("survey_file", "").strip(),
                "survey_date": row.get("survey_date", "").strip() or None,
                "vote_id": vote_id_raw,
                "vote_summary_original": row.get("vote_summary_original", "").strip(),
                "vote_summary_clean": row.get("vote_summary_clean", "").strip(),
                "vote_date": row.get("vote_date", "").strip() or None,
                "days_between": parse_int(row.get("days_between", "")),
                "similarity_score": parse_float(row.get("similarity_score", "")),
                "llm_related": parse_bool(row.get("llm_related", "")),
                "llm_explanation": row.get("llm_explanation", "").strip() or None,
                "source": row.get("source", "Eurobarometer").strip() or "Eurobarometer",
                "admin_validated": None,
            })

    logger.info(f"Parsed {len(rows)} rows, inserting in batches of {BATCH_SIZE}...")

    for start in range(0, len(rows), BATCH_SIZE):
        batch = rows[start : start + BATCH_SIZE]
        supabase.table("survey_vote_matches").upsert(batch, on_conflict="match_id").execute()
        logger.info(f"  Inserted rows {start}–{start + len(batch) - 1}")

    logger.info(f"Done. {len(rows)} matches imported.")


if __name__ == "__main__":
    source = sys.argv[1] if len(sys.argv) > 1 else GITHUB_CSV_URL
    import_csv(source)
