import json
from pathlib import Path
from typing import List

from .models import Project

DATA_DIR = Path(__file__).parent.parent.parent / "data"


class ProjectService:
    """Project service."""

    @staticmethod
    def get_projects() -> List[Project]:
        """Get list of projects from JSON file."""
        projects_file = DATA_DIR / "projects.json"
        if not projects_file.exists():
            return []

        with open(projects_file, encoding="utf-8") as f:
            projects_data = json.load(f)
            return [Project(**p) for p in projects_data]
