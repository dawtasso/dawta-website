import random
from typing import Any

from loguru import logger

from src.models import SurveyVoteMatch, ValidationStats
from src.supabase_client import get_supabase


class JudgmentService:
    """Service for admin validation of survey-vote matches using Supabase."""

    @classmethod
    def get_random_match(cls, source: str | None = None) -> SurveyVoteMatch | None:
        """Get a random unvalidated match (admin_validated IS NULL)."""
        try:
            supabase = get_supabase()
            query = (
                supabase.table("survey_vote_matches")
                .select("*", count="exact")
                .is_("admin_validated", "null")
            )
            if source:
                query = query.eq("source", source)
            count_response = query.limit(0).execute()
            total = count_response.count or 0
            if total == 0:
                return None
            offset = random.randint(0, total - 1)
            fetch_query = (
                supabase.table("survey_vote_matches")
                .select("*")
                .is_("admin_validated", "null")
            )
            if source:
                fetch_query = fetch_query.eq("source", source)
            response = fetch_query.range(offset, offset).execute()
            if response.data:
                return cls._row_to_match(response.data[0])
            return None
        except Exception:
            logger.exception("Error fetching random unvalidated match")
            return None

    @classmethod
    def validate_match(cls, match_id: str, validated: bool) -> bool:
        """Set admin_validated on a match. Returns True on success."""
        try:
            supabase = get_supabase()
            supabase.table("survey_vote_matches").update(
                {"admin_validated": validated}
            ).eq("match_id", match_id).execute()
            return True
        except Exception:
            logger.exception("Error validating match")
            return False

    @classmethod
    def clear_match_validation(cls, match_id: str) -> bool:
        """Reset admin_validated to NULL on a match. Returns True on success."""
        try:
            supabase = get_supabase()
            supabase.table("survey_vote_matches").update(
                {"admin_validated": None}
            ).eq("match_id", match_id).execute()
            return True
        except Exception:
            logger.exception("Error clearing match validation")
            return False

    @classmethod
    def get_validation_stats(cls) -> ValidationStats:
        """Get counts of accepted / refused / pending matches."""
        try:
            supabase = get_supabase()

            total_resp = (
                supabase.table("survey_vote_matches")
                .select("*", count="exact")
                .limit(0)
                .execute()
            )
            total = total_resp.count or 0

            accepted_resp = (
                supabase.table("survey_vote_matches")
                .select("*", count="exact")
                .eq("admin_validated", True)
                .limit(0)
                .execute()
            )
            accepted = accepted_resp.count or 0

            refused_resp = (
                supabase.table("survey_vote_matches")
                .select("*", count="exact")
                .eq("admin_validated", False)
                .limit(0)
                .execute()
            )
            refused = refused_resp.count or 0

            pending = total - accepted - refused

            return ValidationStats(
                accepted=accepted,
                refused=refused,
                pending=pending,
                total=total,
            )
        except Exception:
            logger.exception("Error fetching validation stats")
            return ValidationStats()

    @classmethod
    def get_all_matches(
        cls, source: str | None = None, status: str | None = None
    ) -> list[SurveyVoteMatch]:
        """Get all matches, ordered by similarity_score DESC.

        Optional filters:
        - source: 'ESS' or 'Eurobarometer'
        - status: 'accepted', 'refused', or 'pending'
        """
        try:
            supabase = get_supabase()
            query = supabase.table("survey_vote_matches").select("*")

            if source:
                query = query.eq("source", source)

            if status == "accepted":
                query = query.eq("admin_validated", True)
            elif status == "refused":
                query = query.eq("admin_validated", False)
            elif status == "pending":
                query = query.is_("admin_validated", "null")

            response = (
                query.order("similarity_score", desc=True).limit(1000).execute()
            )
            return [cls._row_to_match(row) for row in response.data]
        except Exception:
            logger.exception("Error fetching all matches")
            return []

    @classmethod
    def get_validated_matches(cls, status: str | None = None) -> list[SurveyVoteMatch]:
        """Get matches filtered by validation status.

        status: 'accepted', 'refused', or None for all validated (both).
        """
        try:
            supabase = get_supabase()
            query = supabase.table("survey_vote_matches").select("*")

            if status == "accepted":
                query = query.eq("admin_validated", True)
            elif status == "refused":
                query = query.eq("admin_validated", False)
            else:
                query = query.not_.is_("admin_validated", "null")

            response = query.limit(500).execute()
            return [cls._row_to_match(row) for row in response.data]
        except Exception:
            logger.exception("Error fetching validated matches")
            return []

    @staticmethod
    def _row_to_match(row: dict) -> SurveyVoteMatch:
        """Convert a Supabase row to a SurveyVoteMatch model."""
        return SurveyVoteMatch(
            match_id=row["match_id"],
            question_id=row.get("question_id"),
            question_clean=row.get("question_clean"),
            question_original=row.get("question_original"),
            survey_file=row.get("survey_file"),
            survey_date=row.get("survey_date"),
            vote_id=row.get("vote_id"),
            vote_summary_original=row.get("vote_summary_original"),
            vote_summary_clean=row.get("vote_summary_clean"),
            vote_date=row.get("vote_date"),
            days_between=row.get("days_between"),
            similarity_score=row.get("similarity_score"),
            predicted_probability=row.get("predicted_probability"),
            llm_related=row.get("llm_related"),
            llm_explanation=row.get("llm_explanation"),
            source=row.get("source"),
            admin_validated=row.get("admin_validated"),
        )
