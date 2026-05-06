import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { fetchEpAffairs, type EpAffairSummary } from '../api/client';
import { PageHeader, LoadingState, ErrorMessage, PageLayout } from '../components';

const CATEGORY_COLORS: Record<string, string> = {
  'corruption': 'bg-red-100 text-red-700',
  'fraude fiscale': 'bg-orange-100 text-orange-700',
  'abus de biens sociaux': 'bg-amber-100 text-amber-700',
  'prise illégale d\'intérêts': 'bg-yellow-100 text-yellow-700',
  'détournement de fonds publics': 'bg-purple-100 text-purple-700',
  'favoritisme': 'bg-pink-100 text-pink-700',
};

function getCategoryColor(category: string | undefined): string {
  if (!category) return 'bg-gray-100 text-gray-600';
  return CATEGORY_COLORS[category.toLowerCase()] || 'bg-dawta-100 text-dawta-700';
}

export default function EpAffairs() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const { data: affairs = [], isLoading, error } = useQuery({
    queryKey: ['epAffairs'],
    queryFn: fetchEpAffairs,
  });

  const noArticleCount = useMemo(
    () => affairs.filter((c) => c.articleCount === 0).length,
    [affairs],
  );

  const filtered = useMemo(() => {
    const withArticles = affairs.filter((c) => c.articleCount > 0);
    if (!searchQuery.trim()) return withArticles;
    const q = searchQuery.toLowerCase();
    return withArticles.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.politicianName?.toLowerCase().includes(q) ||
        c.category?.toLowerCase().includes(q),
    );
  }, [affairs, searchQuery]);

  return (
    <PageLayout maxWidth="6xl">
      <PageHeader
        title="Affaires judiciaires"
        subtitle="Parcourez les affaires judiciaires et labelisez la pertinence des articles"
      />

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-tertiary" />
          <input
            type="text"
            placeholder="Rechercher par titre, politicien, catégorie..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-theme-light bg-theme-secondary text-theme-primary placeholder:text-theme-tertiary focus:outline-none focus:ring-2 focus:ring-dawta-400"
          />
        </div>
      </div>

      {isLoading && <LoadingState message="Chargement des affaires..." />}

      {error && (
        <ErrorMessage
          title="Erreur"
          message="Impossible de charger les affaires."
          hint="Vérifiez que le backend est démarré."
        />
      )}

      {!isLoading && !error && (
        <>
          <p className="text-xs text-theme-tertiary mb-1">
            {filtered.length} affaire{filtered.length !== 1 ? 's' : ''}
          </p>
          {noArticleCount > 0 && (
            <p className="text-xs text-theme-tertiary/60 mb-3">
              {noArticleCount} affaire{noArticleCount !== 1 ? 's' : ''} sans articles collectés
            </p>
          )}

          <div className="space-y-2">
            {filtered.map((c) => (
              <AffairRow key={c.affairId} affair={c} onClick={() => navigate(`/projects/europressing/cases/${c.affairId}`)} />
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-center text-theme-tertiary py-12">
              Aucune affaire ne correspond à la recherche.
            </p>
          )}
        </>
      )}
    </PageLayout>
  );
}

function AffairRow({ affair: c, onClick }: { affair: EpAffairSummary; onClick: () => void }) {
  const fullyLabeled = c.articleCount > 0 && c.labeledCount >= c.articleCount;
  const noArticles = c.articleCount === 0;
  const refDate = c.dateStart || c.dateFacts;

  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
        fullyLabeled
          ? 'border-green-200 bg-green-50/30 hover:bg-green-50/60'
          : noArticles
          ? 'border-theme-light bg-theme-secondary/30 opacity-50'
          : 'border-theme-light bg-theme-secondary hover:bg-theme-secondary/80'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-theme-primary truncate">{c.title}</p>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            {c.politicianName && (
              <span className="text-xs text-theme-tertiary">
                {c.politicianName}
                {c.politicianParty && (
                  <span className="ml-1 text-theme-tertiary/60">({c.politicianParty})</span>
                )}
              </span>
            )}
            {c.category && (
              <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded ${getCategoryColor(c.category)}`}>
                {c.category}
              </span>
            )}
            {refDate && (
              <span className="text-xs text-theme-tertiary">{refDate}</span>
            )}
          </div>
        </div>
        <div className="flex-shrink-0 flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-emerald-500 font-medium">{c.highCount}<span className="text-emerald-400 font-normal">H</span></span>
            <span className="text-amber-500 font-medium">{c.mediumCount}<span className="text-amber-400 font-normal">M</span></span>
            <span className="text-red-500 font-medium">{c.lowCount}<span className="text-red-400 font-normal">L</span></span>
          </div>
          <div className="text-right">
            <span className={`text-xs font-medium ${fullyLabeled ? 'text-green-600' : 'text-theme-tertiary'}`}>
              {c.labeledCount}/{c.articleCount}
            </span>
            <div className="text-xs text-theme-tertiary">articles</div>
          </div>
        </div>
      </div>
    </button>
  );
}
