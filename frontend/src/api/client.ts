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
  githubUrl?: string;
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

