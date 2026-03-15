from fastapi import APIRouter, HTTPException

from src.models import (
    AdminJudgmentRequest,
    AnswerAlignmentRequest,
    MatchWithAnswers,
    SurveyVoteMatch,
    ValidationStats,
)
from src.services.answer_service import AnswerService
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


# ─── Answer alignment endpoints ───


@router.get("/answers/matches", response_model=list[MatchWithAnswers])
async def get_accepted_matches_with_answers():
    """Get all accepted matches with their survey answer options and saved alignments."""
    matches = JudgmentService.get_all_matches(status="accepted")
    if not matches:
        return []

    answer_keys = list({(m.question_id, m.survey_file or "") for m in matches if m.question_id})
    match_ids = [m.match_id for m in matches]

    answers_map = AnswerService.get_answers_bulk(answer_keys)
    alignments_map = AnswerService.get_alignments_bulk(match_ids)

    result = []
    for m in matches:
        key = (m.question_id, m.survey_file or "") if m.question_id else None
        answers = answers_map.get(key, []) if key else []
        alignments = alignments_map.get(m.match_id, {})
        result.append(
            MatchWithAnswers(match=m, answers=answers, alignments=alignments)
        )
    return result


@router.post("/answers/label")
async def save_answer_alignments(request: AnswerAlignmentRequest):
    """Save alignment labels for a match's survey answers."""
    alignments = [
        {"answer_label": a.answer_label, "alignment": a.alignment}
        for a in request.alignments
    ]
    success = AnswerService.save_alignments(request.match_id, alignments)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to save alignments")
    return {"ok": True}


@router.get("/answers/stats")
async def get_labelling_stats():
    """Get stats about answer labelling progress."""
    return AnswerService.get_labelling_stats()
