import { useQuery } from '@tanstack/react-query';
import { fetchProjects } from '../api/client';
import {
  PageHeader,
  ErrorMessage,
  LoadingState,
  PageLayout,
  ProjectsList,
} from '../components';

export default function Projects() {
  const { data: projects, isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  });

  return (
    <PageLayout>
      <PageHeader
        title="Projets"
        subtitle="Nos analyses statistiques sur des données publiques."
      />

      {isLoading && <LoadingState message="Chargement des projets..." />}

      {error && (
        <ErrorMessage
          title="Erreur de chargement"
          message={error.message}
          hint="Vérifiez que le backend est lancé : make start-backend"
        />
      )}

      {projects && <ProjectsList projects={projects} />}
    </PageLayout>
  );
}
