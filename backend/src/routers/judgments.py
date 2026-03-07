from fastapi import APIRouter, HTTPException

from src.models import AdminJudgmentRequest, SurveyVoteMatch, ValidationStats
from src.services.judgment_service import JudgmentService

router = APIRouter(prefix="/judgments", tags=["judgments"])


@router.get("/matches/random", response_model=SurveyVoteMatch)
async def get_random_match(source: str | None = None):
    """Get a random unvalidated survey-vote match. Optional source filter: ESS, Eurobarometer."""
    match = JudgmentService.get_random_match(source=source)
    if not match:
        raise HTTPException(status_code=404, detail="No unvalidated matches available")
    return match


@router.post("/validate")
async def validate_match(request: AdminJudgmentRequest):
    """Accept or refuse a match (admin validation)."""
    success = JudgmentService.validate_match(
        match_id=request.match_id,
        validated=request.validated,
    )
    if not success:
        raise HTTPException(status_code=500, detail="Failed to validate match")
    return {"ok": True}


@router.post("/clear")
async def clear_match(match_id: str):
    """Reset admin_validated to NULL (unclassify a match)."""
    success = JudgmentService.clear_match_validation(match_id=match_id)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to clear match validation")
    return {"ok": True}


@router.get("/stats", response_model=ValidationStats)
async def get_stats():
    """Get validation statistics (accepted, refused, pending, total)."""
    return JudgmentService.get_validation_stats()


@router.get("/matches/all", response_model=list[SurveyVoteMatch])
async def get_all_matches(source: str | None = None, status: str | None = None):
    """Get all matches ordered by similarity score DESC. Optional filters: source (ESS/Eurobarometer), status (accepted/refused/pending)."""
    return JudgmentService.get_all_matches(source=source, status=status)


@router.get("/validated", response_model=list[SurveyVoteMatch])
async def get_validated_matches(status: str | None = None):
    """Get validated matches. Query param status: 'accepted', 'refused', or omit for all."""
    return JudgmentService.get_validated_matches(status)
