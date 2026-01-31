import { useQuery } from '@tanstack/react-query';
import { fetchProjects } from '../api/client';
import {
  PageHeader,
  ErrorMessage,
  LoadingState,
  PageLayout,
  ProjectsList,
} from '../components';

export default function Home() {
  const { data: projects, isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  });

  return (
    <PageLayout maxWidth="4xl">
      <PageHeader title="Projects" subtitle="Manage and track all dawta projects" />

      {isLoading && <LoadingState message="Loading projects..." />}

      {error && (
        <ErrorMessage
          title="Error loading projects"
          message={error.message}
          hint="Make sure the backend is running: make start-backend"
        />
      )}

      {projects && <ProjectsList projects={projects} />}
    </PageLayout>
  );
}
