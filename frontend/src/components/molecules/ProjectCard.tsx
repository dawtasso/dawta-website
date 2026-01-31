import { motion } from 'framer-motion';
import type { Project } from '../../api/client';
import { Heading, StatusBadge, Text } from '../atoms';

type ProjectCardProps = {
  project: Project;
};

function getStatusVariant(status: string) {
  switch (status.toLowerCase()) {
    case 'active':
      return 'success' as const;
    case 'completed':
      return 'default' as const;
    case 'pending':
      return 'warning' as const;
    default:
      return 'default' as const;
  }
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <motion.article
      className="relative card-glow rounded-lg p-6 group"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3 }}
    >
      {/* Diffraction hover effect */}
      <motion.div
        className="absolute inset-0 rounded-lg pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 30% 50%, rgba(142, 202, 230, 0.08) 0%, transparent 50%)',
        }}
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />

      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <Heading level={3} glare={false} className="text-luminous-primary">
            {project.name}
          </Heading>
          <StatusBadge status={project.status} variant={getStatusVariant(project.status)} />
        </div>
        
        <Text variant="muted" size="sm">
          {project.description}
        </Text>

        {/* Bottom spectral line on hover */}
        <motion.div
          className="absolute -bottom-6 left-0 right-0 h-[0.5px]"
          style={{
            background: 'linear-gradient(90deg, transparent, var(--color-spectral-sky), var(--color-spectral-amber), transparent)',
          }}
          initial={{ scaleX: 0, opacity: 0 }}
          whileHover={{ scaleX: 1, opacity: 0.5 }}
          transition={{ duration: 0.4 }}
        />
      </div>
    </motion.article>
  );
}
