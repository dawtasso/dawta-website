import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { fetchProjects } from '../api/client';
import {
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
    <PageLayout maxWidth="4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <header className="mb-16">
          <h1 className="text-6xl font-display text-[#F5F0EB] mb-4">Projets</h1>
          <div className="w-16 h-0.5 bg-vermillion" />
        </header>

        {isLoading && <LoadingState message="Chargement des projets..." />}

        {error && (
          <ErrorMessage
            title="Erreur de chargement"
            message={error.message}
            hint="Verifiez que le backend est lance : make start-backend"
          />
        )}

        {projects && <ProjectsList projects={projects} />}
      </motion.div>
    </PageLayout>
  );
}
