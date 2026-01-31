import { getFileUrl, type Project } from '../../api/client';
import { Heading, StatusBadge, Text } from '../atoms';

type ProjectCardProps = {
  project: Project;
};

function getStatusVariant(status: string) {
  switch (status.toLowerCase()) {
    case 'published':
      return 'success' as const;
    case 'draft':
      return 'warning' as const;
    default:
      return 'default' as const;
  }
}

function getStatusLabel(status: string) {
  switch (status.toLowerCase()) {
    case 'published':
      return 'Publié';
    case 'draft':
      return 'Brouillon';
    default:
      return status;
  }
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="border-b border-theme-light pb-6 last:border-b-0">
      <Heading level={2} className="mb-2">
        {project.title}
      </Heading>
      <Text variant="muted" className="mb-3">
        {project.description}
      </Text>
      <div className="flex items-center gap-3 flex-wrap">
        <StatusBadge status={getStatusLabel(project.status)} variant={getStatusVariant(project.status)} />
        {project.hasSlide && (
          <a
            href={getFileUrl(project.id, 'slide')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-dawta-700 bg-dawta-50 border border-dawta-200 hover:bg-dawta-100 transition-colors"
          >
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Slide
          </a>
        )}
        {project.hasReport && (
          <a
            href={getFileUrl(project.id, 'report')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-dawta-950 bg-dawta-100 border border-dawta-300 hover:bg-dawta-200 transition-colors"
          >
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Rapport
          </a>
        )}
      </div>
    </article>
  );
}
