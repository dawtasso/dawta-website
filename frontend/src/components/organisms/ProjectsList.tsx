import type { Project } from '../../api/client';
import { useSecretMode } from '../../contexts/SecretModeContext';
import { ProjectCard } from '../molecules';

type ProjectsListProps = {
  projects: Project[];
};

export default function ProjectsList({ projects }: ProjectsListProps) {
  const { showHidden } = useSecretMode();

  const visibleProjects = showHidden
    ? projects
    : projects.filter((p) => !p.hidden);

  if (visibleProjects.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[#78716C]">Aucun projet trouve.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 ml-4">
      {visibleProjects.map((project, index) => (
        <ProjectCard key={project.id} project={project} index={index} />
      ))}
      <div className="pt-6 text-center">
        <p className="text-[#78716C] font-serif italic text-lg">et plus a venir...</p>
      </div>
    </div>
  );
}
