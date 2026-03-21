import { Link } from 'react-router-dom';
import { type Project } from '../../api/client';
import { Heading, Text, Button } from '../atoms';

type ProjectCardProps = {
  project: Project;
  index?: number;
};

export default function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <article className="group relative pl-8 pb-8 border-l-2 border-gold/20 hover:border-gold/60 transition-colors duration-300 last:pb-0">
      {/* Decorative index number */}
      {index !== undefined && (
        <span className="absolute -left-5 top-0 text-6xl font-display text-ink-50/40 group-hover:text-gold/30 transition-colors duration-300 select-none leading-none">
          {String(index + 1).padStart(2, '0')}
        </span>
      )}
      <div className="relative p-6 rounded-lg bg-surface/50 border border-border/50 group-hover:border-vermillion/30 group-hover:shadow-lg group-hover:shadow-vermillion/5 transition-all duration-300">
        <Link to={`/projects/${project.id}`} className="group/link">
          <Heading level={2} className="mb-2 group-hover/link:text-vermillion transition-colors duration-200">
            {project.title}
          </Heading>
        </Link>
        <Text variant="muted" className="mb-4 max-w-2xl">
          {project.description}
        </Text>

        <div className="mt-4 flex items-center gap-3 flex-wrap">
          <Button
            to={`/projects/${project.id}`}
            variant="ghost"
            size="md"
          >
            En savoir plus
            <svg className="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Button>
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-sans text-[#78716C] hover:text-mint transition-colors duration-200"
            >
              Source
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
