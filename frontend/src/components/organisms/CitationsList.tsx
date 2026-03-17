import { useQuery } from '@tanstack/react-query';
import { fetchCitations, getCitationLogoUrl } from '../../api/client';
import { Heading } from '../atoms';

export default function CitationsList() {
  const { data: citations } = useQuery({
    queryKey: ['citations'],
    queryFn: fetchCitations,
  });

  if (!citations || citations.length === 0) {
    return null;
  }

  return (
    <section className="w-full max-w-4xl mx-auto px-4 py-8">
      <Heading level={4} className="text-center text-theme-tertiary mb-3 text-sm uppercase tracking-wide">
        Ils nous ont cités
      </Heading>
      <div className="flex flex-wrap items-center justify-center gap-6">
        {citations.map((citation) => (
          <a
            key={citation.id}
            href={citation.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-theme-secondary transition-colors duration-200"
          >
            <img
              src={getCitationLogoUrl(citation.logo)}
              alt={citation.name}
              className={`w-auto object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-200 ${
                citation.id === 'letelegramme' ? 'max-h-[60px] max-w-[310px]' : 'max-h-6 max-w-[120px]'
              }`}
            />
          </a>
        ))}
      </div>
    </section>
  );
}
