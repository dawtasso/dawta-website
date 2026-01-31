from fastapi import APIRouter

from src.models import Project
from src.services import ProjectService

router = APIRouter(prefix="/projects", tags=["projects"])


@router.get("", response_model=list[Project])
async def get_projects():
    """Get list of all projects."""
    return ProjectService.get_projects()
