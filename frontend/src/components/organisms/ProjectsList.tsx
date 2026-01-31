import type { Project } from '../../api/client';
import { ProjectCard } from '../molecules';

type ProjectsListProps = {
  projects: Project[];
};

export default function ProjectsList({ projects }: ProjectsListProps) {
  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Aucun projet trouvé.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
      <div className="pt-6 text-center">
        <p className="text-theme-secondary italic">et plus à venir</p>
      </div>
    </div>
  );
}
