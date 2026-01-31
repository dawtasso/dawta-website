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
    has_summary: bool = Field(False, alias="hasSummary")
    has_partial_report: bool = Field(False, alias="hasPartialReport")
    github_url: str | None = Field(None, alias="githubUrl")

    model_config = {"populate_by_name": True}
