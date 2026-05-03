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
      {project.hasJudgeFeature && project.id === 'ue-pair-correlation' && (
        <div className="mb-8 flex gap-4 flex-wrap">
          <Button
            to={`/projects/${project.id}/judge`}
            size="lg"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            Comparer des paires
          </Button>
          <Button
            to={`/projects/${project.id}/label-answers`}
            size="lg"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a2 2 0 012-2z" />
            </svg>
            Étiqueter des réponses
          </Button>
          <Button
            to={`/projects/${project.id}/demographic-alignment`}
            size="lg"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Alignement démographique
          </Button>
        </div>
      )}
      {project.id === 'europressing' && (
        <div className="mb-8 flex gap-4 flex-wrap">
          <Button
            to={`/projects/europressing/cases`}
            size="lg"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            Parcourir les affaires
          </Button>
        </div>
      )}
    </PageLayout>
  );
}

