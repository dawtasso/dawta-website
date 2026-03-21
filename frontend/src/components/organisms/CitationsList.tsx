import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { fetchCitations, getCitationLogoUrl } from '../../api/client';

export default function CitationsList() {
  const { data: citations } = useQuery({
    queryKey: ['citations'],
    queryFn: fetchCitations,
  });

  if (!citations || citations.length === 0) {
    return null;
  }

  return (
    <motion.section
      className="w-full max-w-4xl mx-auto px-4 py-12"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.8 }}
    >
      <h4 className="text-center text-[#78716C] mb-6 text-xs font-sans font-semibold uppercase tracking-[0.2em]">
        Ils nous ont cites
      </h4>
      <div className="flex flex-wrap items-center justify-center gap-6">
        {citations.map((citation) => (
          <a
            key={citation.id}
            href={citation.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 px-3 py-2 rounded hover:bg-white/5 transition-colors duration-200"
          >
            <img
              src={getCitationLogoUrl(citation.logo)}
              alt={citation.name}
              className={`w-auto object-contain grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300 invert ${
                citation.id === 'letelegramme' ? 'max-h-[60px] max-w-[310px]' : 'max-h-6 max-w-[120px]'
              }`}
            />
          </a>
        ))}
      </div>
    </motion.section>
  );
}
