import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchProjects, getFileUrl, getContentUrl } from '../api/client';
import {
  PageHeader,
  ErrorMessage,
  LoadingState,
  PageLayout,
  MarkdownContent,
} from '../components';
import { Button } from '../components/atoms';
import PDFViewer from '../components/molecules/PDFViewer';
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

      {/* Quick access links */}
      <div className="flex items-center gap-3 flex-wrap mb-8">
        {project.hasSlide && (
          <a
            href={getFileUrl(project.id, 'slide')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-dawta-700 bg-dawta-50 border border-dawta-200 hover:bg-dawta-100 transition-colors rounded"
          >
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Télécharger les slides
          </a>
        )}
        {project.hasReport && (
          <a
            href={getFileUrl(project.id, 'report')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-dawta-950 bg-dawta-100 border border-dawta-300 hover:bg-dawta-200 transition-colors rounded"
          >
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Télécharger le rapport
          </a>
        )}
      </div>

      {project.hasSlide && (
        <div className="mb-12">
          <PDFViewer
            url={getFileUrl(project.id, 'slide')}
            title="Nos observations"
          />
        </div>
      )}

      {summaryContent && (
        <section className="mb-12">
          <MarkdownContent content={summaryContent} />
        </section>
      )}

      {partialReportContent && (
        <section className="mb-12">
          <MarkdownContent content={partialReportContent} />
        </section>
      )}
      {project.hasJudgeFeature && (
        <div className="mb-8">
          <Button
            to={`/projects/${project.id}/judge`}
            size="lg"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
            </svg>
            Participer au jugement
          </Button>
        </div>
      )}
    </PageLayout>
  );
}

