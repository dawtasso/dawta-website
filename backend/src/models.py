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
    match_key: str | None = Field(None, alias="matchKey")
    question_id: str | None = Field(None, alias="questionId")
    question_clean: str | None = Field(None, alias="questionClean")
    question_original: str | None = Field(None, alias="questionOriginal")
    survey_file: str | None = Field(None, alias="surveyFile")
    survey_date: str | None = Field(None, alias="surveyDate")
    vote_id: int | None = Field(None, alias="voteId")
    procedure_reference: str | None = Field(None, alias="procedureReference")
    vote_summary_original: str | None = Field(None, alias="voteSummaryOriginal")
    vote_summary_clean: str | None = Field(None, alias="voteSummaryClean")
    vote_date: str | None = Field(None, alias="voteDate")
    days_between: int | None = Field(None, alias="daysBetween")
    similarity_score: float | None = Field(None, alias="similarityScore")
    predicted_probability: float | None = Field(None, alias="predictedProbability")
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


# ─── Correlation / Demographic alignment models ───


class DemographicAlignmentSummary(BaseModel):
    total_questions: int = Field(alias="totalQuestions")
    total_alignments: int = Field(alias="totalAlignments")

    model_config = {"populate_by_name": True}


class DemographicGroupScore(BaseModel):
    demographic_type: str = Field(alias="demographicType")
    demographic_value: str = Field(alias="demographicValue")
    alignment_rate: float | None = Field(None, alias="alignmentRate")
    net_alignment_score: float | None = Field(None, alias="netAlignmentScore")
    count_aligned: int = Field(0, alias="countAligned")
    count_opposed: int = Field(0, alias="countOpposed")
    count_neutral: int = Field(0, alias="countNeutral")
    question_count: int = Field(0, alias="questionCount")

    model_config = {"populate_by_name": True}


class QuestionDemographicBreakdown(BaseModel):
    demographic_type: str = Field(alias="demographicType")
    demographic_value: str = Field(alias="demographicValue")
    alignment_rate: float | None = Field(None, alias="alignmentRate")
    net_alignment_score: float | None = Field(None, alias="netAlignmentScore")
    count_aligned: int = Field(0, alias="countAligned")
    count_opposed: int = Field(0, alias="countOpposed")
    count_neutral: int = Field(0, alias="countNeutral")

    model_config = {"populate_by_name": True}


class AnswerDemographicCount(BaseModel):
    demographic_type: str = Field(alias="demographicType")
    demographic_value: str = Field(alias="demographicValue")
    count: int = 0
    total_base: int = Field(0, alias="totalBase")
    pct: float = 0

    model_config = {"populate_by_name": True}


class AnswerAlignmentInfo(BaseModel):
    answer_label: str = Field(alias="answerLabel")
    alignment: str  # aligned, opposed, neutral, unknown, unrelated
    demographics: list[AnswerDemographicCount] = []

    model_config = {"populate_by_name": True}


class QuestionAlignmentDetail(BaseModel):
    question_id: str = Field(alias="questionId")
    question_clean: str = Field("", alias="questionClean")
    survey_file: str = Field("", alias="surveyFile")
    vote_id: int | None = Field(None, alias="voteId")
    vote_summary_clean: str = Field("", alias="voteSummaryClean")
    answers: list[AnswerAlignmentInfo] = []
    demographics: list[QuestionDemographicBreakdown] = []

    model_config = {"populate_by_name": True}


class PairwiseZTest(BaseModel):
    group1: str
    group2: str
    rate1: float
    rate2: float
    z_stat: float = Field(alias="zStat")
    p_value: float = Field(alias="pValue")
    significant: bool

    model_config = {"populate_by_name": True}


class DemographicStatistic(BaseModel):
    chi_squared: float = Field(alias="chiSquared")
    p_value: float = Field(alias="pValue")
    cramers_v: float = Field(alias="cramersV")
    significant: bool
    pairwise: list[PairwiseZTest] = []

    model_config = {"populate_by_name": True}


class DemographicAlignmentResponse(BaseModel):
    summary: DemographicAlignmentSummary
    by_demographic: list[DemographicGroupScore] = Field(alias="byDemographic")
    by_question: list[QuestionAlignmentDetail] = Field(alias="byQuestion")
    statistics: dict[str, DemographicStatistic] = {}

    model_config = {"populate_by_name": True}


# ─── Europressing models ───


class EpAffairSummary(BaseModel):
    affair_id: str = Field(alias="affairId")
    title: str = ""
    category: str | None = None
    severity: str | None = None
    status: str | None = None
    date_start: str | None = Field(None, alias="dateStart")
    date_facts: str | None = Field(None, alias="dateFacts")
    date_verdict: str | None = Field(None, alias="dateVerdict")
    politician_name: str | None = Field(None, alias="politicianName")
    politician_party: str | None = Field(None, alias="politicianParty")
    article_count: int = Field(0, alias="articleCount")
    labeled_count: int = Field(0, alias="labeledCount")

    model_config = {"populate_by_name": True}


class EpArticleWithRelevance(BaseModel):
    article_id: str = Field(alias="articleId")
    title: str = ""
    source: str | None = None
    date_published: str | None = Field(None, alias="datePublished")
    content_text: str | None = Field(None, alias="contentText")
    days_since_case: int | None = Field(None, alias="daysSinceCase")
    relevance_category: str | None = Field(None, alias="relevanceCategory")
    relevance_score: float | None = Field(None, alias="relevanceScore")
    manual_judgment: bool | None = Field(None, alias="manualJudgment")
    notes: str | None = None

    model_config = {"populate_by_name": True}


class EpAffairDetail(BaseModel):
    affair_id: str = Field(alias="affairId")
    title: str = ""
    category: str | None = None
    severity: str | None = None
    status: str | None = None
    date_start: str | None = Field(None, alias="dateStart")
    date_facts: str | None = Field(None, alias="dateFacts")
    date_verdict: str | None = Field(None, alias="dateVerdict")
    description: str | None = None
    poligraph_url: str | None = Field(None, alias="poligraphUrl")
    fine_eur: int | None = Field(None, alias="fineEur")
    prison_months: int | None = Field(None, alias="prisonMonths")
    prison_suspended: bool | None = Field(None, alias="prisonSuspended")
    ineligibility_months: int | None = Field(None, alias="ineligibilityMonths")
    politician_name: str | None = Field(None, alias="politicianName")
    politician_party: str | None = Field(None, alias="politicianParty")
    articles: list[EpArticleWithRelevance] = []
    article_count: int = Field(0, alias="articleCount")
    labeled_count: int = Field(0, alias="labeledCount")

    model_config = {"populate_by_name": True}


class EpManualJudgmentRequest(BaseModel):
    article_id: str = Field(alias="articleId")
    affair_id: str = Field(alias="affairId")
    manual_judgment: bool | None = Field(alias="manualJudgment")
    notes: str | None = None

    model_config = {"populate_by_name": True}
