import { PageLayout } from '../components/templates';
import { PageHeader } from '../components/molecules';

export default function About() {
  return (
    <PageLayout>
      <PageHeader
        title="About Dawta"
        subtitle="Empowering data-driven decisions through intelligent analytics."
      />

      <div className="prose prose-slate max-w-none">
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed">
            Dawta is dedicated to transforming complex data into actionable insights. We believe that 
            every organization, regardless of size, should have access to powerful analytics tools 
            that help them make informed decisions and drive meaningful outcomes.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">What We Do</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-50 rounded-xl p-6">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Data Analytics</h3>
              <p className="text-gray-600 text-sm">
                Advanced analytics solutions that help you understand your data and uncover hidden patterns.
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-6">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Reporting</h3>
              <p className="text-gray-600 text-sm">
                Automated reporting tools that deliver insights when and where you need them.
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-6">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Real-time Insights</h3>
              <p className="text-gray-600 text-sm">
                Live dashboards and monitoring tools for instant visibility into your metrics.
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-6">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Customization</h3>
              <p className="text-gray-600 text-sm">
                Flexible solutions tailored to your specific business needs and workflows.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Get in Touch</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Interested in learning more about how Dawta can help your organization? 
            We'd love to hear from you.
          </p>
          <a
            href="https://instagram.com/dawtasso"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium"
          >
            Follow us on Instagram
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </section>
      </div>
    </PageLayout>
  );
}

