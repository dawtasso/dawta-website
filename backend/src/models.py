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
    has_judge_feature: bool = Field(False, alias="hasJudgeFeature")
    github_url: str | None = Field(None, alias="githubUrl")

    model_config = {"populate_by_name": True}


class SurveyVoteMatch(BaseModel):
    """Survey-vote match from the CSV data."""

    question_id: str = Field(alias="questionId")
    vote_id: int = Field(alias="voteId")
    question_text: str = Field(alias="questionText")
    vote_summary: str = Field(alias="voteSummary")
    similarity_score: float = Field(alias="similarityScore")
    llm_score: int = Field(alias="llmScore")
    llm_go: bool = Field(alias="llmGo")

    model_config = {"populate_by_name": True}


class JudgmentStats(BaseModel):
    """Aggregated judgment stats for a match."""

    thumbs_up: int = Field(default=0, alias="thumbsUp")
    thumbs_down: int = Field(default=0, alias="thumbsDown")

    model_config = {"populate_by_name": True}


class JudgmentRequest(BaseModel):
    """Request body for submitting a judgment."""

    question_id: str = Field(alias="questionId")
    vote_id: int = Field(alias="voteId")
    thumbs_up: bool = Field(alias="thumbsUp")

    model_config = {"populate_by_name": True}


