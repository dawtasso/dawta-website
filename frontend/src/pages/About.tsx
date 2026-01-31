import { PageLayout } from '../components/templates';
import { PageHeader } from '../components/molecules';

export default function About() {
  return (
    <PageLayout>
      <PageHeader
        title="Dawta"
        // subtitle=""
      />

      <div className="prose prose-slate max-w-none">
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-dawta-950 mb-4">Qui sommes-nous</h2>
          <p className="text-dawta-700 leading-relaxed">
            Nous nous questionnons et nous intéressons à différents sujets: environnement, politique, montée des nationalismes, etc.
            Nous effectuons des analyses statistiques sur des données publiques, open-source.
            Et partageons nos analyses et observations.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-dawta-950 mb-4">Nous contacter</h2>
          <p className="text-dawta-700 leading-relaxed mb-4">
            Pour toute question sur nos analyses ou pour proposer une collaboration, 
            vous pouvez nous contacter via Instagram.
          </p>
          <a
            href="https://instagram.com/dawtasso"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-dawta hover:text-dawta-700 font-medium"
          >
            Suivez-nous sur Instagram
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </section>
      </div>
    </PageLayout>
  );
}
