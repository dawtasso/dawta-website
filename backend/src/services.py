import json
from pathlib import Path
from typing import Any, Dict, List

from loguru import logger

from .models import Project
from .settings import settings

DATA_DIR = Path(settings.data_dir)


class ProjectService:
    """Project service."""

    @staticmethod
    def get_projects() -> List[Project]:
        """Get list of projects from JSON file."""
        projects_file: Path = DATA_DIR / "projects.json"

        # Log data directory info for debugging
        logger.info(f"Data directory: {DATA_DIR}")
        logger.info(f"Data directory exists: {DATA_DIR.exists()}")
        logger.info(f"Projects file path: {projects_file}")
        logger.info(f"Projects file exists: {projects_file.exists()}")

        if not projects_file.exists():
            logger.warning(f"Projects file not found at {projects_file}")
            if DATA_DIR.exists():
                logger.info(f"Contents of {DATA_DIR}: {list(DATA_DIR.iterdir())}")
            return []

        try:
            with open(projects_file, encoding="utf-8") as f:
                projects_data: List[Dict[str, Any]] = json.load(f)
                projects: List[Project] = []
                for p in projects_data:
                    project_dir = DATA_DIR / p["id"]
                    # Check if summary.md and structure.md exist
                    p["hasSummary"] = (project_dir / "summary.md").exists()
                    p["hasPartialReport"] = (project_dir / "partial_report.md").exists()
                    projects.append(Project.model_validate(p))
                logger.info(f"Successfully loaded {len(projects)} projects")
                return projects
        except Exception as e:
            logger.error(f"Error loading projects: {e}", exc_info=True)
            return []
