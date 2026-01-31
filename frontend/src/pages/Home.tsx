import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { fetchProjects } from '../api/client';
import {
  PageHeader,
  ErrorMessage,
  LoadingState,
  PageLayout,
  ProjectsList,
  Text,
} from '../components';

export default function Home() {
  const { data: projects, isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  });

  const activeCount = projects?.filter(p => p.status.toLowerCase() === 'active').length ?? 0;
  const totalCount = projects?.length ?? 0;

  return (
    <PageLayout maxWidth="4xl">
      <PageHeader 
        title="Projects" 
        subtitle="Track and manage initiatives across politics, economy, and environment" 
      />

      {/* Quick stats */}
      {projects && projects.length > 0 && (
        <motion.div
          className="flex gap-8 mb-10 pb-8 border-b border-black/5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div>
            <Text variant="muted" size="sm" className="uppercase tracking-wider text-xs">
              Total
            </Text>
            <p className="text-2xl font-display font-semibold text-ink mt-1">
              {totalCount}
            </p>
          </div>
          <div>
            <Text variant="muted" size="sm" className="uppercase tracking-wider text-xs">
              Active
            </Text>
            <p className="text-2xl font-display font-semibold text-earth-forest mt-1">
              {activeCount}
            </p>
          </div>
        </motion.div>
      )}

      {/* Content */}
      {isLoading && <LoadingState message="Loading projects..." />}

      {error && (
        <ErrorMessage
          title="Unable to load projects"
          message={error.message}
          hint="Make sure the backend is running: make start-backend"
        />
      )}

      {projects && <ProjectsList projects={projects} />}
    </PageLayout>
  );
}
