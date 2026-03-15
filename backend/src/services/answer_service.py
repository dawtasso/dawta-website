"""Service for loading survey answer options and managing answer alignments."""

import csv
import io
from urllib.request import urlopen

from loguru import logger
from src.supabase_client import get_supabase

ANSWERS_CSV_URL = "https://raw.githubusercontent.com/dawtasso/eu_survey_correlation/refs/heads/main/data/surveys/volume_b_answer_distributions.csv"

# Cache: question_id (sheet_id) -> list of answer labels
_answers_cache: dict[str, list[str]] | None = None


def _load_answers() -> dict[str, list[str]]:
    """Load and cache answer labels from the CSV, grouped by sheet_id."""
    global _answers_cache
    if _answers_cache is not None:
        return _answers_cache

    logger.info(f"Loading answer distributions from {ANSWERS_CSV_URL}")
    with urlopen(ANSWERS_CSV_URL) as resp:
        data = resp.read().decode("utf-8")

    result: dict[str, list[str]] = {}
    reader = csv.DictReader(io.StringIO(data))
    for row in reader:
        sheet_id = row.get("sheet_id", "").strip()
        answer = row.get("answer_label", "").strip()
        is_summary = row.get("is_summary", "").strip().lower() == "true"
        demo_type = row.get("demographic_type", "").strip()

        # Only keep non-summary, total-level rows to get unique answer labels
        if not sheet_id or not answer or is_summary or demo_type != "total":
            continue

        if sheet_id not in result:
            result[sheet_id] = []
        if answer not in result[sheet_id]:
            result[sheet_id].append(answer)

    _answers_cache = result
    logger.info(f"Loaded answers for {len(result)} questions")
    return result


class AnswerService:
    """Manages survey answer options and alignment labels."""

    @classmethod
    def get_answers_for_question(cls, question_id: str) -> list[str]:
        """Return the list of possible answer labels for a question."""
        answers = _load_answers()
        return answers.get(question_id, [])

    @classmethod
    def get_answers_bulk(cls, question_ids: list[str]) -> dict[str, list[str]]:
        """Return answers for multiple questions at once."""
        answers = _load_answers()
        return {qid: answers.get(qid, []) for qid in question_ids}

    @classmethod
    def get_alignments_for_match(cls, match_id: str) -> dict[str, str]:
        """Get saved alignments for a match: {answer_label: alignment}."""
        try:
            supabase = get_supabase()
            response = (
                supabase.table("survey_answer_alignments")
                .select("answer_label, alignment")
                .eq("match_id", match_id)
                .execute()
            )
            return {row["answer_label"]: row["alignment"] for row in response.data}
        except Exception:
            logger.exception("Error fetching alignments for match")
            return {}

    @classmethod
    def get_alignments_bulk(cls, match_ids: list[str]) -> dict[str, dict[str, str]]:
        """Get alignments for multiple matches at once."""
        if not match_ids:
            return {}
        try:
            supabase = get_supabase()
            response = (
                supabase.table("survey_answer_alignments")
                .select("match_id, answer_label, alignment")
                .in_("match_id", match_ids)
                .execute()
            )
            result: dict[str, dict[str, str]] = {}
            for row in response.data:
                mid = row["match_id"]
                if mid not in result:
                    result[mid] = {}
                result[mid][row["answer_label"]] = row["alignment"]
            return result
        except Exception:
            logger.exception("Error fetching bulk alignments")
            return {}

    @classmethod
    def save_alignments(cls, match_id: str, alignments: list[dict[str, str]]) -> bool:
        """Save or update answer alignments for a match.

        alignments: list of {answer_label, alignment}
        """
        try:
            supabase = get_supabase()
            rows = [
                {
                    "match_id": match_id,
                    "answer_label": a["answer_label"],
                    "alignment": a["alignment"],
                }
                for a in alignments
            ]
            supabase.table("survey_answer_alignments").upsert(
                rows, on_conflict="match_id,answer_label"
            ).execute()
            return True
        except Exception:
            logger.exception("Error saving alignments")
            return False

    @classmethod
    def get_labelling_stats(cls) -> dict:
        """Get stats about how many accepted matches have been fully labelled."""
        try:
            supabase = get_supabase()

            # Count accepted matches
            accepted_resp = (
                supabase.table("survey_vote_matches")
                .select("*", count="exact")
                .eq("admin_validated", True)
                .limit(0)
                .execute()
            )
            total_accepted = accepted_resp.count or 0

            # Count distinct match_ids in alignments table
            alignments_resp = (
                supabase.table("survey_answer_alignments").select("match_id").execute()
            )
            labelled_match_ids = set(row["match_id"] for row in alignments_resp.data)

            return {
                "totalAccepted": total_accepted,
                "labelled": len(labelled_match_ids),
                "remaining": total_accepted - len(labelled_match_ids),
            }
        except Exception:
            logger.exception("Error fetching labelling stats")
            return {"totalAccepted": 0, "labelled": 0, "remaining": 0}
