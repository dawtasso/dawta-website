import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { fetchProjects } from '../api/client';
import {
  PageHeader,
  ErrorMessage,
  LoadingState,
  PageLayout,
  ProjectsList,
  DiffractionLogo,
  DataRay,
  Text,
} from '../components';

export default function Home() {
  const { data: projects, isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  });

  return (
    <PageLayout maxWidth="4xl">
      {/* Hero section with large diffraction logo */}
      <motion.section
        className="flex items-center justify-between mb-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="max-w-xl">
          <PageHeader 
            title="Projects" 
            subtitle="Manage and track all dawta projects with luminous clarity" 
          />
        </div>
        
        {/* Large animated logo as visual anchor */}
        <motion.div
          className="hidden lg:block"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
        >
          <DiffractionLogo size="xl" />
        </motion.div>
      </motion.section>

      {/* Stats preview section */}
      <motion.section
        className="grid grid-cols-3 gap-4 mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {[
          { label: 'Total Projects', value: projects?.length ?? '—' },
          { label: 'Active', value: projects?.filter(p => p.status.toLowerCase() === 'active').length ?? '—' },
          { label: 'Completed', value: projects?.filter(p => p.status.toLowerCase() === 'completed').length ?? '—' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            className="card-glow rounded-lg p-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
          >
            <Text variant="muted" size="sm" className="uppercase tracking-wider font-mono">
              {stat.label}
            </Text>
            <p className="text-3xl font-display font-bold text-glare mt-2">
              {stat.value}
            </p>
          </motion.div>
        ))}
      </motion.section>

      {/* Data ray separator */}
      <DataRay direction="horizontal" className="mb-12" />

      {/* Projects list */}
      <section>
        {isLoading && <LoadingState message="Analyzing project data..." />}

        {error && (
          <ErrorMessage
            title="Error loading projects"
            message={error.message}
            hint="Make sure the backend is running: make start-backend"
          />
        )}

        {projects && <ProjectsList projects={projects} />}
      </section>
    </PageLayout>
  );
}
