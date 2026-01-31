import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchProjects } from '../api/client';
import { PageLayout, PageHeader, LoadingState, ErrorMessage } from '../components';

export default function Home() {
  const { data: projects, isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  });

  const recentProjects = projects?.slice(0, 3) || [];

  return (
    <PageLayout maxWidth="6xl">
      <div className="text-center mb-16">
        <PageHeader
          title="Dawta"
          subtitle="Analyses statistiques sur données publiques"
        />
        <p className="text-lg text-theme-secondary max-w-2xl mx-auto mt-6 leading-relaxed">
          Association française qui réalise des analyses statistiques sur des données publiques 
          et open-source. Nous explorons des sujets variés : environnement, politique, 
          montée des nationalismes, et autres enjeux de société.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="bg-theme-secondary rounded-xl p-6 border border-theme-light">
          <div className="w-12 h-12 bg-dawta-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-dawta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-theme-primary mb-2">Données publiques</h3>
          <p className="text-sm text-theme-secondary">
            Analyses basées exclusivement sur des sources de données ouvertes et vérifiables.
          </p>
        </div>

        <div className="bg-theme-secondary rounded-xl p-6 border border-theme-light">
          <div className="w-12 h-12 bg-dawta-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-dawta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-theme-primary mb-2">Méthodologie rigoureuse</h3>
          <p className="text-sm text-theme-secondary">
            Sources et méthodologie documentées pour chaque projet.
          </p>
        </div>

        <div className="bg-theme-secondary rounded-xl p-6 border border-theme-light">
          <div className="w-12 h-12 bg-dawta-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-dawta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-theme-primary mb-2">Transparence</h3>
          <p className="text-sm text-theme-secondary">
            Analyses reproductibles avec code source et données disponibles publiquement.
          </p>
        </div>
      </div>

      {isLoading && <LoadingState message="Chargement des projets..." />}

      {error && (
        <ErrorMessage
          title="Erreur de chargement"
          message={error.message}
          hint="Vérifiez que le backend est lancé : make start-backend"
        />
      )}

      {projects && projects.length > 0 && (
        <div className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-theme-primary">Projets récents</h2>
            <Link
              to="/projects"
              className="text-sm font-medium text-dawta hover:text-dawta-700 transition-colors"
            >
              Voir tous les projets →
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {recentProjects.map((project) => (
              <div
                key={project.id}
                className="bg-theme-secondary rounded-xl p-6 border border-theme-light hover:border-theme transition-colors"
              >
                <h3 className="text-lg font-semibold text-theme-primary mb-2">{project.title}</h3>
                <p className="text-sm text-theme-secondary mb-4 line-clamp-2">{project.description}</p>
                <Link
                  to="/projects"
                  className="text-sm font-medium text-dawta hover:text-dawta-700 transition-colors"
                >
                  En savoir plus →
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </PageLayout>
  );
}
