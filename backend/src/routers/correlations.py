from fastapi import APIRouter

from src.models import DemographicAlignmentResponse
from src.services.correlation_service import CorrelationService

router = APIRouter(prefix="/correlations", tags=["correlations"])


@router.get(
    "/demographic-alignment",
    response_model=DemographicAlignmentResponse,
)
async def get_demographic_alignment(demographic_type: str | None = None):
    """Get demographic alignment with parliamentary votes.

    Optional query parameter `demographic_type` to filter:
    gender, income_difficulty, class_belonging.
    """
    return CorrelationService.get_demographic_alignment(
        demographic_type=demographic_type,
    )


@router.post("/invalidate-cache")
async def invalidate_cache():
    """Invalidate cached correlation results."""
    CorrelationService.invalidate_cache()
    return {"ok": True}
