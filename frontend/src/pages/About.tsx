import { PageLayout } from '../components/templates';
import { PageHeader } from '../components/molecules';

export default function About() {
  return (
    <PageLayout>
      <PageHeader
        title="À propos"
        subtitle="Association française d'analyse de données publiques."
      />

      <div className="prose prose-slate max-w-none">
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-dawta-950 mb-4">Qui sommes-nous</h2>
          <p className="text-dawta-700 leading-relaxed">
            Nous sommes une association française qui n'avons pas une idée claire de ce que nous faisons.
            Mais nous le faisons. Nous nous questionnons et s'intéressons à différents sujets: environnement, politique, montée des nationalismes, etc.
            Nous effectuons des analyses statistiques sur des données publiques, open-source.
            Et tentons de propager nos analyses et observations.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-dawta-950 mb-4">Notre approche</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-dawta-50 rounded-xl p-6 border border-dawta-200">
              <div className="w-10 h-10 bg-dawta-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-dawta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-dawta-950 mb-2">Données publiques</h3>
              <p className="text-dawta-700 text-sm">
                Nous utilisons exclusivement des sources de données ouvertes et vérifiables : 
                données gouvernementales, statistiques officielles, bases de données publiques.
              </p>
            </div>

            <div className="bg-dawta-50 rounded-xl p-6 border border-dawta-200">
              <div className="w-10 h-10 bg-dawta-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-dawta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-dawta-950 mb-2">Méthodologie rigoureuse</h3>
              <p className="text-dawta-700 text-sm">
                Nous documentons nos sources et notre méthodologie pour chaque projet.
              </p>
            </div>

            <div className="bg-dawta-50 rounded-xl p-6 border border-dawta-200">
              <div className="w-10 h-10 bg-dawta-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-dawta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-dawta-950 mb-2">Transparence</h3>
              <p className="text-dawta-700 text-sm">
                Toutes nos analyses sont reproductibles. Le code source et les données 
                utilisées sont disponibles publiquement.
              </p>
            </div>

            <div className="bg-dawta-50 rounded-xl p-6 border border-dawta-200">
              <div className="w-10 h-10 bg-dawta-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-dawta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-dawta-950 mb-2">Indépendance</h3>
              <p className="text-dawta-700 text-sm">
                Association à but non lucratif, nous ne sommes affiliés à aucun 
                parti politique ni groupe d'intérêt.
              </p>
            </div>
          </div>
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
