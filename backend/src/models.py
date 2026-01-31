from pydantic import BaseModel, Field


class Project(BaseModel):
    """Project model."""

    id: str  # slug unique (ex: "environnement")
    title: str
    description: str
    long_description: str | None = Field(None, alias="longDescription")
    status: str  # "published", "draft"
    published_at: str | None = Field(None, alias="publishedAt")
    has_slide: bool = Field(False, alias="hasSlide")
    has_report: bool = Field(False, alias="hasReport")

    model_config = {"populate_by_name": True}
