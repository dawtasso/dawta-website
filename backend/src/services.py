import json
from pathlib import Path
from typing import Any, Dict, List

from .models import Project

DATA_DIR = Path(__file__).parent.parent.parent / "data"


class ProjectService:
    """Project service."""

    @staticmethod
    def get_projects() -> List[Project]:
        """Get list of projects from JSON file."""
        projects_file: Path = DATA_DIR / "projects.json"
        if not projects_file.exists():
            return []

        with open(projects_file, encoding="utf-8") as f:
            projects_data: List[Dict[str, Any]] = json.load(f)
            projects: List[Project] = []
            for p in projects_data:
                project_dir = DATA_DIR / p["id"]
                # Check if summary.md and structure.md exist
                p["hasSummary"] = (project_dir / "summary.md").exists()
                p["hasPartialReport"] = (project_dir / "partial_report.md").exists()
                projects.append(Project.model_validate(p))
            return projects
