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
    <section className="w-full max-w-4xl mx-auto px-4 py-12">
      <Heading level={3} className="text-center text-theme-primary mb-4">
        Ils nous ont cités
      </Heading>
      <div className="flex flex-wrap items-center justify-center gap-8">
        {citations.map((citation) => (
          <a
            key={citation.id}
            href={citation.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center gap-3 p-4 rounded-lg hover:bg-theme-secondary transition-colors duration-200"
          >
            <img
              src={getCitationLogoUrl(citation.logo)}
              alt={citation.name}
              className="h-5 w-auto object-contain group-hover:grayscale-0 transition-all duration-200"
            />
            {/* <span className="text-sm text-theme-tertiary group-hover:text-theme-primary transition-colors duration-200">
              {citation.name}
            </span> */}
          </a>
        ))}
      </div>
    </section>
  );
}
