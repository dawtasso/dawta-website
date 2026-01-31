import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchProjects, getFileUrl, getContentUrl } from '../api/client';
import {
  PageHeader,
  ErrorMessage,
  LoadingState,
  PageLayout,
} from '../components';
import { Button } from '../components/atoms';
import { useEffect, useState } from 'react';

export default function ProjectDetail() {
  const { projectId } = useParams<{ projectId: string }>();
  const [summaryContent, setSummaryContent] = useState<string | null>(null);
  const [partialReportContent, setPartialReportContent] = useState<string | null>(null);

  const { data: projects, isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  });

  const project = projects?.find((p) => p.id === projectId);

  useEffect(() => {
    if (project?.hasSummary && projectId) {
      fetch(getContentUrl(projectId, 'summary'))
        .then((res) => res.text())
        .then((text) => setSummaryContent(text))
        .catch(() => setSummaryContent(null));
    }
    if (project?.hasPartialReport && projectId) {
      fetch(getContentUrl(projectId, 'partial_report'))
        .then((res) => res.text())
        .then((text) => setPartialReportContent(text))
        .catch(() => setPartialReportContent(null));
    }
  }, [project, projectId]);

  if (isLoading) {
    return (
      <PageLayout>
        <LoadingState message="Chargement du projet..." />
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout>
        <ErrorMessage
          title="Erreur de chargement"
          message={error.message}
          hint="Vérifiez que le backend est lancé : make start-backend"
        />
      </PageLayout>
    );
  }

  if (!project) {
    return (
      <PageLayout>
        <ErrorMessage
          title="Projet non trouvé"
          message="Le projet demandé n'existe pas."
        />
      </PageLayout>
    );
  }

  return (
    <PageLayout maxWidth="4xl">
      <PageHeader
        title={project.title}        
      />

      <div className="flex flex-wrap gap-4 mb-8">
        {project.hasReport && (
          <Button
            href={getFileUrl(project.id, 'report')}
            target="_blank"
            rel="noopener noreferrer"
            size="lg"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Télécharger le rapport complet (PDF)
          </Button>
        )}
        {project.hasSlide && (
          <a
            href={getFileUrl(project.id, 'slide')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-5 py-2.5 text-dawta-700 bg-dawta-50 border border-dawta-200 text-sm font-semibold rounded-lg hover:bg-dawta-100 transition-all duration-200"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Voir le slide
          </a>
        )}
      </div>

      <div className="prose prose-slate max-w-none">
        {summaryContent && (
          <section className="mb-12">
            <div className="markdown-content space-y-4">
              {summaryContent.split('\n\n').map((paragraph, idx) => {
                if (!paragraph.trim()) return null;
                
                if (paragraph.startsWith('# ')) {
                  return (
                    <h2 key={idx} className="text-2xl font-semibold text-theme-primary mb-4 mt-8">
                      {paragraph.substring(2).trim()}
                    </h2>
                  );
                }
                if (paragraph.startsWith('## ')) {
                  return (
                    <h3 key={idx} className="text-xl font-semibold text-theme-primary mb-3 mt-6">
                      {paragraph.substring(3).trim()}
                    </h3>
                  );
                }
                if (paragraph.startsWith('### ')) {
                  return (
                    <h4 key={idx} className="text-lg font-semibold text-theme-primary mb-2 mt-4">
                      {paragraph.substring(4).trim()}
                    </h4>
                  );
                }
                
                // Handle bold text
                const processedParagraph = paragraph
                  .split(/(\*\*.*?\*\*)/g)
                  .map((part, partIdx) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                      return <strong key={partIdx} className="font-semibold text-theme-primary">{part.slice(2, -2)}</strong>;
                    }
                    return part;
                  });
                
                return (
                  <p key={idx} className="text-theme-secondary leading-relaxed">
                    {processedParagraph}
                  </p>
                );
              })}
            </div>
          </section>
        )}

        {partialReportContent && (
          <section className="mb-12">
            <div className="markdown-content space-y-4">
              {partialReportContent.split('\n\n').map((paragraph, idx) => {
                if (!paragraph.trim()) return null;
                
                if (paragraph.startsWith('# ')) {
                  return (
                    <h2 key={idx} className="text-2xl font-semibold text-theme-primary mb-4 mt-8">
                      {paragraph.substring(2).trim()}
                    </h2>
                  );
                }
                if (paragraph.startsWith('## ')) {
                  return (
                    <h3 key={idx} className="text-xl font-semibold text-theme-primary mb-3 mt-6">
                      {paragraph.substring(3).trim()}
                    </h3>
                  );
                }
                if (paragraph.startsWith('### ')) {
                  return (
                    <h4 key={idx} className="text-lg font-semibold text-theme-primary mb-2 mt-4">
                      {paragraph.substring(4).trim()}
                    </h4>
                  );
                }
                
                // Handle bold text
                const processedParagraph = paragraph
                  .split(/(\*\*.*?\*\*)/g)
                  .map((part, partIdx) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                      return <strong key={partIdx} className="font-semibold text-theme-primary">{part.slice(2, -2)}</strong>;
                    }
                    return part;
                  });
                
                return (
                  <p key={idx} className="text-theme-secondary leading-relaxed">
                    {processedParagraph}
                  </p>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </PageLayout>
  );
}

