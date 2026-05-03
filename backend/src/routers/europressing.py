from fastapi import APIRouter, HTTPException

from src.models import EpCaseDetail, EpLegalCaseSummary, EpManualJudgmentRequest
from src.services.europressing_service import EuropressingService

router = APIRouter(prefix="/europressing", tags=["europressing"])


@router.get("/cases", response_model=list[EpLegalCaseSummary])
async def get_cases():
    """Get all legal cases with article and label counts."""
    return EuropressingService.get_all_cases()


@router.get("/cases/{affair_id}", response_model=EpCaseDetail)
async def get_case_detail(affair_id: str):
    """Get case detail with articles and relevance scores."""
    detail = EuropressingService.get_case_detail(affair_id)
    if not detail:
        raise HTTPException(status_code=404, detail="Case not found")
    return detail


@router.post("/label")
async def label_article(request: EpManualJudgmentRequest):
    """Set or clear manual_judgment and notes on an article-case pair."""
    success = EuropressingService.set_manual_judgment(
        article_id=request.article_id,
        affair_id=request.affair_id,
        manual_judgment=request.manual_judgment,
        notes=request.notes,
    )
    if not success:
        raise HTTPException(status_code=500, detail="Failed to save judgment")
    return {"ok": True}
