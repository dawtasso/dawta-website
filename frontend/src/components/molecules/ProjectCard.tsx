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
    <article className="border-b border-gray-200 pb-6 last:border-b-0">
      <Heading level={2} className="mb-2">
        {project.name}
      </Heading>
      <Text variant="muted" className="mb-3">
        {project.description}
      </Text>
      <StatusBadge status={project.status} variant={getStatusVariant(project.status)} />
    </article>
  );
}
