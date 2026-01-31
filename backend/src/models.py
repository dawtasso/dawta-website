from pydantic import BaseModel


class Project(BaseModel):
    """Project model."""

    id: int
    name: str
    description: str
    status: str
