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
