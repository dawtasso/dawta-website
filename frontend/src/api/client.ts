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
}

export interface SurveyVoteMatch {
  matchId: string;
  questionId: string;
  questionIndex: number;
  questionText: string;
  fileName: string;
  voteId: number;
  voteSummary: string;
  similarityScore: number;
  llmScore?: number;
  llmGo?: boolean;
}

export interface JudgmentStats {
  thumbsUp: number;
  thumbsDown: number;
}

export interface JudgmentOverallStats {
  totalMatches: number;
  matchesJudged: number;
  totalJudgments: number;
  thumbsUp: number;
  thumbsDown: number;
  agreementRate: number;
}

export interface JudgmentEntry {
  matchId: string;
  thumbsUp: boolean;
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

// Judgments API
export async function fetchRandomMatch(): Promise<SurveyVoteMatch> {
  const response = await fetch(`${API_BASE_URL}/api/judgments/matches/random`);
  if (!response.ok) {
    throw new Error(`Failed to fetch match: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export async function fetchAllMatches(): Promise<SurveyVoteMatch[]> {
  const response = await fetch(`${API_BASE_URL}/api/judgments/matches`);
  if (!response.ok) {
    throw new Error(`Failed to fetch matches: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export async function submitJudgment(matchId: string, thumbsUp: boolean): Promise<JudgmentStats> {
  const response = await fetch(`${API_BASE_URL}/api/judgments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ matchId, thumbsUp }),
  });
  if (!response.ok) {
    throw new Error(`Failed to submit judgment: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export async function fetchJudgmentStats(): Promise<JudgmentOverallStats> {
  const response = await fetch(`${API_BASE_URL}/api/judgments/stats`);
  if (!response.ok) {
    throw new Error(`Failed to fetch stats: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export async function fetchJudgments(): Promise<JudgmentEntry[]> {
  const response = await fetch(`${API_BASE_URL}/api/judgments/all`);
  if (!response.ok) {
    throw new Error(`Failed to fetch judgments: ${response.status} ${response.statusText}`);
  }
  return response.json();
}
