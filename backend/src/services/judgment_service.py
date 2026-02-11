import random
from typing import Any

from loguru import logger

from src.models import JudgmentStats, SurveyVoteMatch, JudgmentRequest
from src.supabase_client import get_supabase


class JudgmentService:
    """Service for survey-vote match judgments using Supabase."""

    @classmethod
    def get_all_matches(cls) -> list[SurveyVoteMatch]:
        """Get all matches from Supabase."""
        try:
            response = get_supabase().table("survey_vote_matches").select("*").execute()
            return [cls._row_to_match(row) for row in response.data]
        except Exception as e:
            logger.exception("Error fetching matches")
            return []

    @classmethod
    def get_random_match(cls) -> SurveyVoteMatch | None:
        """Get a random match from Supabase."""
        try:
            supabase = get_supabase()
            # Get total count
            # show the full table
            count_response = supabase.table("survey_vote_matches").select("*", count="exact").limit(0).execute()
            total = count_response.count or 0
            if total == 0:
                return None
            # Get random offset and fetch one match
            offset = random.randint(0, total - 1)
            response = supabase.table("survey_vote_matches").select("*").range(offset, offset).execute()
            if response.data:
                return cls._row_to_match(response.data[0])
            return None
        except Exception as e:
            logger.exception("Error fetching random match")
            return None

    @classmethod
    def submit_judgment(cls, match_id: str, thumbs_up: bool) -> JudgmentStats:
        """Submit a judgment for a match."""
        try:
            supabase = get_supabase()

            supabase.table("judgments").insert({
                "match_id": match_id,
                "thumbs_up": thumbs_up,
            }).execute()

            return cls._get_match_stats(match_id)
        except Exception as e:
            logger.exception("Error submitting judgment")
            return JudgmentStats(thumbs_up=0, thumbs_down=0)

    @classmethod
    def get_stats(cls) -> dict[str, Any]:
        """Get aggregated judgment statistics."""
        try:
            supabase = get_supabase()

            # Total matches
            matches_response = (
                supabase.table("survey_vote_matches")
                .select("*", count="exact")
                .execute()
            )
            total_matches = matches_response.count or 0

            # Judgment stats
            judgments_response = supabase.table("judgments").select("match_id, thumbs_up").execute()
            judgments = judgments_response.data or []

            total_thumbs_up = sum(1 for j in judgments if j["thumbs_up"])
            total_thumbs_down = len(judgments) - total_thumbs_up
            total_judgments = len(judgments)

            # Unique matches judged
            unique_matches = len({j["match_id"] for j in judgments})

            return {
                "totalMatches": total_matches,
                "matchesJudged": unique_matches,
                "totalJudgments": total_judgments,
                "thumbsUp": total_thumbs_up,
                "thumbsDown": total_thumbs_down,
                "agreementRate": total_thumbs_up / total_judgments if total_judgments > 0 else 0,
            }
        except Exception as e:
            logger.exception("Error fetching stats")
            return {
                "totalMatches": 0,
                "matchesJudged": 0,
                "totalJudgments": 0,
                "thumbsUp": 0,
                "thumbsDown": 0,
                "agreementRate": 0,
            }

    @classmethod
    def _get_match_stats(cls, match_id: str) -> JudgmentStats:
        """Get judgment stats for a specific match."""
        try:
            response = (
                get_supabase()
                .table("judgments")
                .select("thumbs_up")
                .eq("match_id", match_id)
                .execute()
            )
            judgments = response.data or []
            thumbs_up = sum(1 for j in judgments if j["thumbs_up"])
            thumbs_down = len(judgments) - thumbs_up
            return JudgmentStats(thumbs_up=thumbs_up, thumbs_down=thumbs_down)
        except Exception as e:
            logger.exception("Error fetching match stats")
            return JudgmentStats(thumbs_up=0, thumbs_down=0)

    @staticmethod
    def _row_to_match(row: dict) -> SurveyVoteMatch:
        """Convert a Supabase row to a SurveyVoteMatch model."""
        return SurveyVoteMatch(
            match_id=row["match_id"],
            question_id=row["question_id"],
            question_index=row["question_index"],
            question_text=row["question_text"],
            file_name=row["file_name"],
            vote_id=row["vote_id"],
            vote_summary=row["vote_summary"],
            similarity_score=row["similarity_score"],
            llm_score=row.get("llm_score"),
            llm_go=row.get("llm_go"),
        )

    @classmethod
    def get_judgments(cls) -> list[JudgmentRequest]:
        """Get all judgments requests from Supabase."""
        try:
            response = get_supabase().table("judgments").select("match_id, thumbs_up").execute()
            return [JudgmentRequest(
                match_id=row["match_id"],
                thumbs_up=bool(row["thumbs_up"]),
            ) for row in response.data]
        except Exception as e:
            logger.exception("Error fetching judgments")
            return []
