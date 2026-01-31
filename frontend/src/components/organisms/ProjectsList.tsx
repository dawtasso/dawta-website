import { motion } from 'framer-motion';
import type { Project } from '../../api/client';
import { ProjectCard } from '../molecules';
import { Text } from '../atoms';

type ProjectsListProps = {
  projects: Project[];
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

export default function ProjectsList({ projects }: ProjectsListProps) {
  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="card-editorial p-10 max-w-md mx-auto">
          <Text variant="muted">
            No projects found.
          </Text>
          <Text variant="muted" size="sm" className="mt-2">
            Projects will appear here once created.
          </Text>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-3"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {projects.map((project) => (
        <motion.div key={project.id} variants={itemVariants}>
          <ProjectCard project={project} />
        </motion.div>
      ))}
    </motion.div>
  );
}
