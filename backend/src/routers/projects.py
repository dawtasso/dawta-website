from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse, Response

from src.models import Project
from src.services.project_services import ProjectService
from src.settings import settings, DATA_DIR

router = APIRouter(prefix="/projects", tags=["projects"])


@router.get("/debug")
async def debug_info():
    """Debug endpoint to check data directory configuration."""
    projects_file = DATA_DIR / "projects.json"
    return {
        "data_dir": str(DATA_DIR),
        "data_dir_from_settings": settings.data_dir,
        "projects_file_exists": projects_file.exists(),
        "projects_file_path": str(projects_file),
        "data_dir_exists": DATA_DIR.exists(),
    }


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

    # Use inline disposition for slides (to view in browser), attachment for reports (to download)
    disposition = "inline" if file_type == "slide" else "attachment"

    return FileResponse(
        file_path,
        media_type="application/pdf",
        filename=f"{project_id}-{file_type}.pdf",
        headers={
            "Content-Disposition": f'{disposition}; filename="{project_id}-{file_type}.pdf"'
        },
    )


@router.get("/{project_id}/content/{content_type}")
async def get_project_content(project_id: str, content_type: str):
    """Get project content (summary or partial_report markdown)."""
    if content_type not in ["summary", "partial_report"]:
        raise HTTPException(
            status_code=400, detail="content_type must be 'summary' or 'partial_report'"
        )

    # Map content_type to filename
    filename = (
        "partial_report.md"
        if content_type == "partial_report"
        else f"{content_type}.md"
    )
    file_path = DATA_DIR / project_id / filename

    if not file_path.exists():
        raise HTTPException(status_code=404, detail=f"File not found: {filename}")

    with open(file_path, encoding="utf-8") as f:
        content = f.read()

    return Response(content=content, media_type="text/markdown")
