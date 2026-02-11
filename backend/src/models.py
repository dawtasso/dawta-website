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
    """Survey-vote match from Supabase."""

    match_id: str = Field(alias="matchId")
    question_id: str | None = Field(None, alias="questionId")
    question_index: str | None = Field(None, alias="questionIndex")
    question_text: str | None = Field(None, alias="questionText")
    file_name: str | None = Field(None, alias="fileName")
    vote_id: int | None = Field(None, alias="voteId")
    vote_summary: str | None = Field(None, alias="voteSummary")
    similarity_score: float | None = Field(None, alias="similarityScore")
    llm_score: int | None = Field(None, alias="llmScore")
    llm_go: bool | None = Field(None, alias="llmGo")

    model_config = {"populate_by_name": True}


class JudgmentStats(BaseModel):
    """Aggregated judgment stats for a match."""

    thumbs_up: int = Field(default=0, alias="thumbsUp")
    thumbs_down: int = Field(default=0, alias="thumbsDown")

    model_config = {"populate_by_name": True}


class JudgmentRequest(BaseModel):
    """Request body for submitting a judgment."""

    match_id: str = Field(alias="matchId")
    thumbs_up: bool = Field(alias="thumbsUp")

    model_config = {"populate_by_name": True}


