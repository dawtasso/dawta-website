import { motion } from 'framer-motion';
import { PageLayout } from '../components/templates';

export default function About() {
  return (
    <PageLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <header className="mb-16">
          <h1 className="text-6xl font-display text-[#F5F0EB] mb-4">A propos</h1>
          <div className="w-16 h-0.5 bg-vermillion" />
        </header>

        <div className="max-w-2xl">
          <section className="mb-16">
            <h2 className="text-2xl font-serif text-[#F5F0EB] mb-6">Qui sommes-nous</h2>
            <p className="text-lg text-[#A8A29E] leading-relaxed font-serif">
              Nous nous questionnons et nous interessons a differents sujets: environnement, politique, montee des nationalismes, etc.
              Nous effectuons des analyses statistiques sur des donnees publiques, open-source.
              Et partageons nos analyses et observations.
            </p>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-serif text-[#F5F0EB] mb-6">Nous contacter</h2>
            <p className="text-lg text-[#A8A29E] leading-relaxed font-serif mb-8">
              Pour toute question sur nos analyses ou pour proposer une collaboration,
              vous pouvez nous contacter via email ou Instagram.
            </p>

            <div className="space-y-6">
              <div>
                <p className="text-sm font-sans font-semibold text-[#78716C] uppercase tracking-widest mb-2">Email</p>
                <a
                  href="mailto:dawta.contact@proton.me"
                  className="inline-flex items-center text-lg font-serif text-mint hover:text-mint-300 transition-colors"
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  dawta.contact@proton.me
                </a>
              </div>

              <div>
                <p className="text-sm font-sans font-semibold text-[#78716C] uppercase tracking-widest mb-2">Instagram</p>
                <a
                  href="https://instagram.com/dawtasso"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-lg font-serif text-mint hover:text-mint-300 transition-colors"
                >
                  <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"/>
                  </svg>
                  @dawtasso
                </a>
              </div>
            </div>
          </section>
        </div>
      </motion.div>
    </PageLayout>
  );
}
