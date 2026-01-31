from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

from src.models import Project
from src.services import DATA_DIR, ProjectService

router = APIRouter(prefix="/projects", tags=["projects"])


@router.get("", response_model=list[Project])
async def get_projects():
    """Get list of all projects."""
    return ProjectService.get_projects()


@router.get("/{project_id}/files/{file_type}")
async def get_project_file(project_id: str, file_type: str):
    """Get project file (slide or report PDF)."""
    if file_type not in ["slide", "report"]:
        raise HTTPException(
            status_code=400, detail="file_type must be 'slide' or 'report'"
        )

    file_path = DATA_DIR / project_id / f"{file_type}.pdf"

    if not file_path.exists():
        raise HTTPException(status_code=404, detail=f"File not found: {file_type}.pdf")

    return FileResponse(
        file_path,
        media_type="application/pdf",
        filename=f"{project_id}-{file_type}.pdf",
    )
