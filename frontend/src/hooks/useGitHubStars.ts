import { useQuery } from '@tanstack/react-query';

/**
 * Extract owner and repo from GitHub URL
 * Example: https://github.com/dawtasso/ligue1_team_travel_emissions
 * Returns: { owner: 'dawtasso', repo: 'ligue1_team_travel_emissions' }
 */
function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  try {
    const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (match) {
      return { owner: match[1], repo: match[2] };
    }
    return null;
  } catch {
    return null;
  }
}

async function fetchGitHubStars(githubUrl: string): Promise<number | null> {
  const parsed = parseGitHubUrl(githubUrl);
  if (!parsed) {
    return null;
  }

  try {
    const response = await fetch(
      `https://api.github.com/repos/${parsed.owner}/${parsed.repo}`,
      {
        headers: {
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.stargazers_count || 0;
  } catch (error) {
    console.error('Error fetching GitHub stars:', error);
    return null;
  }
}

export function useGitHubStars(githubUrl: string | undefined) {
  return useQuery({
    queryKey: ['github-stars', githubUrl],
    queryFn: () => fetchGitHubStars(githubUrl!),
    enabled: !!githubUrl,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 1,
  });
}

