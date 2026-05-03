const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  status: string;
  publishedAt?: string;
  hasSlide: boolean;
  hasReport: boolean;
  hasSummary: boolean;
  hasPartialReport: boolean;
  hasJudgeFeature?: boolean;
  githubUrl?: string;
  hidden?: boolean;
}

export interface SurveyVoteMatch {
  matchId: string;
  questionId?: string;
  questionClean?: string;
  questionOriginal?: string;
  surveyFile?: string;
  surveyDate?: string;
  voteId?: number;
  voteSummaryOriginal?: string;
  voteSummaryClean?: string;
  voteDate?: string;
  daysBetween?: number;
  similarityScore?: number;
  predictedProbability?: number | null;
  llmRelated?: boolean;
  llmExplanation?: string;
  source?: string;
  adminValidated?: boolean | null;
}

export interface ValidationStats {
  accepted: number;
  refused: number;
  pending: number;
  total: number;
}

export interface Citation {
  id: string;
  name: string;
  logo: string;
  url: string;
}

export function getCitationLogoUrl(logo: string): string {
  if (logo.startsWith('http')) return logo;
  const filename = logo.split('/').pop();
  return `${API_BASE_URL}/api/citations/logos/${filename}`;
}

export async function fetchCitations(): Promise<Citation[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/citations`);
    if (!response.ok) {
      throw new Error(`Failed to fetch citations: ${response.status} ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(`Unable to connect to backend at ${API_BASE_URL}. Make sure the backend server is running.`);
    }
    throw error;
  }
}

export async function fetchProjects(): Promise<Project[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/projects`);
    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.status} ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(`Unable to connect to backend at ${API_BASE_URL}. Make sure the backend server is running.`);
    }
    throw error;
  }
}

export function getFileUrl(projectId: string, type: 'slide' | 'report'): string {
  return `${API_BASE_URL}/api/projects/${projectId}/files/${type}`;
}

export function getContentUrl(projectId: string, type: 'summary' | 'partial_report'): string {
  return `${API_BASE_URL}/api/projects/${projectId}/content/${type}`;
}

// Judgments / Admin validation API

export async function fetchRandomMatch(source?: string): Promise<SurveyVoteMatch> {
  const params = source ? `?source=${encodeURIComponent(source)}` : '';
  const response = await fetch(`${API_BASE_URL}/api/judgments/matches/random${params}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch match: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export async function validateMatch(matchId: string, validated: boolean): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/judgments/validate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ matchId, validated }),
  });
  if (!response.ok) {
    throw new Error(`Failed to validate match: ${response.status} ${response.statusText}`);
  }
}

export async function clearMatchValidation(matchId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/judgments/clear?match_id=${encodeURIComponent(matchId)}`, {
    method: 'POST',
  });
  if (!response.ok) {
    throw new Error(`Failed to clear match: ${response.status} ${response.statusText}`);
  }
}

export async function fetchValidationStats(): Promise<ValidationStats> {
  const response = await fetch(`${API_BASE_URL}/api/judgments/stats`);
  if (!response.ok) {
    throw new Error(`Failed to fetch stats: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export async function fetchAllMatches(source?: string, status?: string): Promise<SurveyVoteMatch[]> {
  const params = new URLSearchParams();
  if (source) params.set('source', source);
  if (status) params.set('status', status);
  const qs = params.toString() ? `?${params.toString()}` : '';
  const response = await fetch(`${API_BASE_URL}/api/judgments/matches/all${qs}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch all matches: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export async function fetchValidatedMatches(status?: string): Promise<SurveyVoteMatch[]> {
  const params = status ? `?status=${status}` : '';
  const response = await fetch(`${API_BASE_URL}/api/judgments/validated${params}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch validated matches: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

// ─── Answer alignment types & API ───

export interface MatchWithAnswers {
  match: SurveyVoteMatch;
  answers: string[];
  alignments: Record<string, string>; // answer_label -> alignment
}

export type Alignment = 'aligned' | 'opposed' | 'neutral' | 'unknown' | 'unrelated';

export async function fetchAcceptedMatchesWithAnswers(): Promise<MatchWithAnswers[]> {
  const response = await fetch(`${API_BASE_URL}/api/judgments/answers/matches`);
  if (!response.ok) {
    throw new Error(`Failed to fetch matches with answers: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export async function saveAnswerAlignments(
  matchId: string,
  alignments: { answerLabel: string; alignment: string }[],
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/judgments/answers/label`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ matchId, alignments }),
  });
  if (!response.ok) {
    throw new Error(`Failed to save alignments: ${response.status} ${response.statusText}`);
  }
}

export async function fetchLabellingStats(): Promise<{
  totalAccepted: number;
  labelled: number;
  remaining: number;
}> {
  const response = await fetch(`${API_BASE_URL}/api/judgments/answers/stats`);
  if (!response.ok) {
    throw new Error(`Failed to fetch labelling stats: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

// ─── Demographic alignment correlation types & API ───

export interface DemographicAlignmentSummary {
  totalQuestions: number;
  totalAlignments: number;
}

export interface DemographicGroupScore {
  demographicType: string;
  demographicValue: string;
  alignmentRate: number | null;
  netAlignmentScore: number | null;
  countAligned: number;
  countOpposed: number;
  countNeutral: number;
  questionCount: number;
}

export interface QuestionDemographicBreakdown {
  demographicType: string;
  demographicValue: string;
  alignmentRate: number | null;
  netAlignmentScore: number | null;
  countAligned: number;
  countOpposed: number;
  countNeutral: number;
}

export interface AnswerDemographicCount {
  demographicType: string;
  demographicValue: string;
  count: number;
  totalBase: number;
  pct: number;
}

export interface AnswerAlignmentInfo {
  answerLabel: string;
  alignment: string;
  demographics: AnswerDemographicCount[];
}

export interface QuestionAlignmentDetail {
  questionId: string;
  questionClean: string;
  surveyFile: string;
  voteId: number | null;
  voteSummaryClean: string;
  answers: AnswerAlignmentInfo[];
  demographics: QuestionDemographicBreakdown[];
}

export interface PairwiseZTest {
  group1: string;
  group2: string;
  rate1: number;
  rate2: number;
  zStat: number;
  pValue: number;
  significant: boolean;
}

export interface DemographicStatistic {
  chiSquared: number;
  pValue: number;
  cramersV: number;
  significant: boolean;
  pairwise: PairwiseZTest[];
}

export interface DemographicAlignmentResponse {
  summary: DemographicAlignmentSummary;
  byDemographic: DemographicGroupScore[];
  byQuestion: QuestionAlignmentDetail[];
  statistics: Record<string, DemographicStatistic>;
}

export async function fetchDemographicAlignment(
  demographicType?: string,
): Promise<DemographicAlignmentResponse> {
  const params = demographicType ? `?demographic_type=${encodeURIComponent(demographicType)}` : '';
  const response = await fetch(`${API_BASE_URL}/api/correlations/demographic-alignment${params}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch demographic alignment: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

// ─── Europressing types & API ───

export interface EpLegalCaseSummary {
  affairId: string;
  title: string;
  category?: string;
  severity?: string;
  status?: string;
  dateStart?: string;
  dateFacts?: string;
  politicianName?: string;
  politicianParty?: string;
  articleCount: number;
  labeledCount: number;
}

export interface EpArticleWithRelevance {
  articleId: string;
  title: string;
  source?: string;
  datePublished?: string;
  contentText?: string;
  daysSinceCase?: number;
  relevanceCategory?: string;
  relevanceScore?: number;
  manualJudgment?: boolean | null;
  notes?: string;
}

export interface EpCaseDetail {
  affairId: string;
  title: string;
  category?: string;
  severity?: string;
  status?: string;
  dateStart?: string;
  dateFacts?: string;
  description?: string;
  politicianName?: string;
  politicianParty?: string;
  articles: EpArticleWithRelevance[];
  articleCount: number;
  labeledCount: number;
}

export async function fetchEpCases(): Promise<EpLegalCaseSummary[]> {
  const response = await fetch(`${API_BASE_URL}/api/europressing/cases`);
  if (!response.ok) {
    throw new Error(`Failed to fetch cases: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export async function fetchEpCaseDetail(affairId: string): Promise<EpCaseDetail> {
  const response = await fetch(`${API_BASE_URL}/api/europressing/cases/${encodeURIComponent(affairId)}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch case detail: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export async function labelEpArticle(
  articleId: string,
  affairId: string,
  manualJudgment: boolean | null,
  notes?: string,
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/europressing/label`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ articleId, affairId, manualJudgment, notes }),
  });
  if (!response.ok) {
    throw new Error(`Failed to label article: ${response.status} ${response.statusText}`);
  }
}
