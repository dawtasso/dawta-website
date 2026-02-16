import json

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from loguru import logger

from src.models import Citation
from src.settings import DATA_DIR

router = APIRouter(prefix="/citations", tags=["citations"])


@router.get("", response_model=list[Citation])
async def get_citations():
    """Get list of external citations/press mentions."""
    citations_file = DATA_DIR / "citations.json"

    if not citations_file.exists():
        logger.warning(f"Citations file not found at {citations_file}")
        return []

    try:
        with open(citations_file, encoding="utf-8") as f:
            return [Citation.model_validate(c) for c in json.load(f)]
    except Exception as e:
        logger.error(f"Error loading citations: {e}", exc_info=True)
        return []


@router.get("/logos/{filename}")
async def get_citation_logo(filename: str):
    """Serve a citation logo image."""
    file_path = DATA_DIR / "logos" / filename

    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Logo not found")

    return FileResponse(file_path)
