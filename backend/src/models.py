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
    hidden: bool = Field(False)

    model_config = {"populate_by_name": True}


class Citation(BaseModel):
    """External citation/press mention."""

    id: str
    name: str
    logo: str
    url: str


class SurveyVoteMatch(BaseModel):
    """Survey-vote match from Supabase (new schema from eu_survey_correlation)."""

    match_id: str = Field(alias="matchId")
    question_id: str | None = Field(None, alias="questionId")
    question_clean: str | None = Field(None, alias="questionClean")
    question_original: str | None = Field(None, alias="questionOriginal")
    survey_file: str | None = Field(None, alias="surveyFile")
    survey_date: str | None = Field(None, alias="surveyDate")
    vote_id: int | None = Field(None, alias="voteId")
    vote_summary_original: str | None = Field(None, alias="voteSummaryOriginal")
    vote_summary_clean: str | None = Field(None, alias="voteSummaryClean")
    vote_date: str | None = Field(None, alias="voteDate")
    days_between: int | None = Field(None, alias="daysBetween")
    similarity_score: float | None = Field(None, alias="similarityScore")
    llm_related: bool | None = Field(None, alias="llmRelated")
    llm_explanation: str | None = Field(None, alias="llmExplanation")
    source: str | None = Field(None)
    admin_validated: bool | None = Field(None, alias="adminValidated")

    model_config = {"populate_by_name": True}


class ValidationStats(BaseModel):
    """Admin validation statistics."""

    accepted: int = 0
    refused: int = 0
    pending: int = 0
    total: int = 0

    model_config = {"populate_by_name": True}


class AdminJudgmentRequest(BaseModel):
    """Request body for admin validation of a match."""

    match_id: str = Field(alias="matchId")
    validated: bool

    model_config = {"populate_by_name": True}


class AnswerAlignment(BaseModel):
    """A single answer label with its alignment classification."""

    answer_label: str = Field(alias="answerLabel")
    alignment: str  # "aligned", "opposed", "neutral", "unknown"

    model_config = {"populate_by_name": True}


class AnswerAlignmentRequest(BaseModel):
    """Request to save answer alignments for a match."""

    match_id: str = Field(alias="matchId")
    alignments: list[AnswerAlignment]

    model_config = {"populate_by_name": True}


class MatchWithAnswers(BaseModel):
    """An accepted match with its available survey answers and saved alignments."""

    match: SurveyVoteMatch
    answers: list[str] = []
    alignments: dict[str, str] = {}  # answer_label -> alignment

    model_config = {"populate_by_name": True}
