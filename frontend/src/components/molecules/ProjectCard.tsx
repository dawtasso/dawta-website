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
      className="card-editorial p-6 group"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <Heading level={3} className="text-ink group-hover:text-earth-forest transition-colors">
          {project.name}
        </Heading>
        <StatusBadge status={project.status} variant={getStatusVariant(project.status)} />
      </div>
      
      <Text variant="muted" size="sm">
        {project.description}
      </Text>
    </motion.article>
  );
}
