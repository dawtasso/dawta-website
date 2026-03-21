import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CitationsList } from '../components/organisms';

export default function Home() {
  return (
    <>
      {/* Asymmetric Hero — text left, logo massive right with glow */}
      <section className="min-h-[85vh] flex items-center overflow-hidden relative">
        {/* Gold diffraction glow behind logo */}
        <div
          className="absolute inset-0 pointer-events-none animate-glow-pulse"
          style={{
            background: 'radial-gradient(ellipse 45% 55% at 75% 50%, rgba(242, 201, 76, 0.08) 0%, rgba(242, 201, 76, 0.03) 40%, transparent 70%)',
          }}
        />
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Title + tagline — LEFT, creating tension with logo on right */}
            <div className="md:col-span-5 relative z-10 order-2 md:order-1">
              <motion.h1
                className="text-7xl md:text-8xl lg:text-9xl font-display text-[#F5F0EB] leading-none"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
              >
                Dawta
              </motion.h1>
              <motion.p
                className="mt-6 text-xl md:text-2xl font-serif text-[#A8A29E] max-w-md leading-relaxed"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6, ease: 'easeOut' }}
              >
                Analyses statistiques sur des donnees publiques.
                Observations partagees.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                <Link
                  to="/projects"
                  className="inline-flex items-center mt-8 text-lg font-sans font-medium text-vermillion hover:text-vermillion-300 transition-colors group"
                >
                  Voir les projets
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </motion.div>
            </div>

            {/* Logo — massive, right-aligned, partially off-screen */}
            <motion.div
              className="md:col-span-7 flex justify-center md:justify-end order-1 md:order-2"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <img
                src="/logo_no_bg_grey.svg"
                alt="Dawta"
                className="h-[35vh] md:h-[60vh] w-auto opacity-80 md:translate-x-12 lg:translate-x-20"
                style={{ filter: 'brightness(0.7) contrast(1.1)' }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Gold arc divider */}
      <div className="flex justify-center py-12">
        <svg width="200" height="60" viewBox="0 0 200 60" fill="none" className="opacity-20">
          <path d="M0 60 Q100 -20 200 60" stroke="#F2C94C" strokeWidth="1" fill="none" />
          <path d="M30 60 Q100 0 170 60" stroke="#F2C94C" strokeWidth="0.8" fill="none" />
          <path d="M60 60 Q100 15 140 60" stroke="#F2C94C" strokeWidth="0.6" fill="none" />
        </svg>
      </div>

      {/* Citations */}
      <CitationsList />
    </>
  );
}
