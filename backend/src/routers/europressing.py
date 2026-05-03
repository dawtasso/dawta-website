from fastapi import APIRouter, HTTPException

from src.models import EpAffairDetail, EpAffairSummary, EpManualJudgmentRequest
from src.services.europressing_service import EuropressingService

router = APIRouter(prefix="/europressing", tags=["europressing"])


@router.get("/cases", response_model=list[EpAffairSummary])
async def get_affairs():
    """Get all affairs with article and label counts."""
    return EuropressingService.get_all_affairs()


@router.get("/cases/{affair_id}", response_model=EpAffairDetail)
async def get_affair_detail(affair_id: str):
    """Get affair detail with articles and relevance scores."""
    detail = EuropressingService.get_affair_detail(affair_id)
    if not detail:
        raise HTTPException(status_code=404, detail="Affair not found")
    return detail


@router.post("/label")
async def label_article(request: EpManualJudgmentRequest):
    """Set or clear manual_judgment and notes on an article-affair pair."""
    success = EuropressingService.set_manual_judgment(
        article_id=request.article_id,
        affair_id=request.affair_id,
        manual_judgment=request.manual_judgment,
        notes=request.notes,
    )
    if not success:
        raise HTTPException(status_code=500, detail="Failed to save judgment")
    return {"ok": True}
