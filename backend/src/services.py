from typing import List

from .models import Project


class ProjectService:
    """Project service."""

    @staticmethod
    def get_projects() -> List[Project]:
        """Get list of projects."""
        return [
            Project(
                id=1,
                name="Project Alpha",
                description="First project in the system",
                status="active",
            ),
            Project(
                id=2,
                name="Project Beta",
                description="Second project for testing",
                status="completed",
            ),
            Project(
                id=3,
                name="Project Gamma",
                description="Third project in development",
                status="active",
            ),
        ]
