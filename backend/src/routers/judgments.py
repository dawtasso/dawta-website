from fastapi import APIRouter, HTTPException

from src.models import JudgmentRequest, JudgmentStats, SurveyVoteMatch
from src.services import JudgmentService

router = APIRouter(prefix="/judgments", tags=["judgments"])


@router.get("/matches", response_model=list[SurveyVoteMatch])
async def get_matches():
    """Get all survey-vote matches."""
    return JudgmentService.get_all_matches()


@router.get("/matches/random", response_model=SurveyVoteMatch)
async def get_random_match():
    """Get a random survey-vote match."""
    match = JudgmentService.get_random_match()
    if not match:
        raise HTTPException(status_code=404, detail="No matches available")
    return match


@router.post("", response_model=JudgmentStats)
async def submit_judgment(judgment: JudgmentRequest):
    """Submit a judgment (thumbs up/down) for a match."""
    return JudgmentService.submit_judgment(
        question_id=judgment.question_id,
        vote_id=judgment.vote_id,
        thumbs_up=judgment.thumbs_up,
    )


@router.get("/stats")
async def get_stats():
    """Get aggregated judgment statistics."""
    return JudgmentService.get_stats()


@router.get("/export")
async def export_judgments():
    """Export all judgments as JSON (for backup)."""
    return JudgmentService.export_judgments()

