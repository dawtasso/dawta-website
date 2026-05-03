import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Check, X, RotateCcw, ChevronDown, ChevronUp, Search, ArrowLeft } from 'lucide-react';
import { fetchEpAffairDetail, labelEpArticle, type EpArticleWithRelevance } from '../api/client';
import { PageHeader, LoadingState, ErrorMessage, PageLayout, StatusBadge } from '../components';

const RELEVANCE_FILTERS = [
  { value: '', label: 'Toutes' },
  { value: 'HIGH', label: 'High' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'LOW', label: 'Low' },
] as const;

const LABEL_FILTERS = [
  { value: '', label: 'Tous' },
  { value: 'unlabeled', label: 'Non labelisés' },
  { value: 'labeled', label: 'Labelisés' },
] as const;

function ChipGroup({
  options,
  value,
  onChange,
}: {
  options: readonly { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-1.5">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${
            value === opt.value
              ? 'bg-dawta-600 text-white shadow-sm'
              : 'bg-theme-secondary text-theme-tertiary hover:bg-dawta-100 hover:text-dawta-700'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function DaysBadge({ days }: { days: number | undefined | null }) {
  if (days == null) return null;
  const label = days >= 0 ? `+${days}j` : `${days}j`;
  const color = days >= 0 ? 'text-blue-600 bg-blue-50' : 'text-orange-600 bg-orange-50';
  return (
    <span className={`inline-block px-1.5 py-0.5 text-xs font-mono rounded ${color}`}>
      {label}
    </span>
  );
}

function RelevanceBadge({ category }: { category: string | undefined }) {
  if (!category) return null;
  const colors: Record<string, string> = {
    HIGH: 'bg-green-100 text-green-700',
    MEDIUM: 'bg-amber-100 text-amber-700',
    LOW: 'bg-red-100 text-red-700',
  };
  return (
    <span className={`inline-block px-2 py-0.5 text-xs font-medium uppercase rounded ${colors[category] || 'bg-gray-100 text-gray-600'}`}>
      {category}
    </span>
  );
}

export default function EpAffairDetail() {
  const { affairId } = useParams<{ affairId: string }>();
  const queryClient = useQueryClient();
  const [relevanceFilter, setRelevanceFilter] = useState('');
  const [labelFilter, setLabelFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedArticle, setExpandedArticle] = useState<string | null>(null);
  const [notesMap, setNotesMap] = useState<Record<string, string>>({});

  const { data: affair, isLoading, error } = useQuery({
    queryKey: ['epAffairDetail', affairId],
    queryFn: () => fetchEpAffairDetail(affairId!),
    enabled: !!affairId,
  });

  const labelMutation = useMutation({
    mutationFn: ({
      articleId,
      manualJudgment,
      notes,
    }: {
      articleId: string;
      manualJudgment: boolean | null;
      notes?: string;
    }) => labelEpArticle(articleId, affairId!, manualJudgment, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['epAffairDetail', affairId] });
      queryClient.invalidateQueries({ queryKey: ['epAffairs'] });
    },
  });

  const filtered = useMemo(() => {
    if (!affair) return [];
    let result = affair.articles;

    if (relevanceFilter) {
      result = result.filter((a) => a.relevanceCategory === relevanceFilter);
    }
    if (labelFilter === 'unlabeled') {
      result = result.filter((a) => a.manualJudgment == null);
    } else if (labelFilter === 'labeled') {
      result = result.filter((a) => a.manualJudgment != null);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.source?.toLowerCase().includes(q),
      );
    }
    return result;
  }, [affair, relevanceFilter, labelFilter, searchQuery]);

  const handleLabel = (articleId: string, manualJudgment: boolean | null) => {
    labelMutation.mutate({
      articleId,
      manualJudgment,
      notes: notesMap[articleId],
    });
  };

  const handleNotesBlur = (articleId: string) => {
    const article = affair?.articles.find((a) => a.articleId === articleId);
    if (!article) return;
    const newNotes = notesMap[articleId];
    // Only save if notes changed and article already has a judgment
    if (article.manualJudgment != null && newNotes !== undefined && newNotes !== (article.notes || '')) {
      labelMutation.mutate({
        articleId,
        manualJudgment: article.manualJudgment,
        notes: newNotes,
      });
    }
  };

  if (isLoading) {
    return (
      <PageLayout maxWidth="6xl">
        <LoadingState message="Chargement de l'affaire..." />
      </PageLayout>
    );
  }

  if (error || !affair) {
    return (
      <PageLayout maxWidth="6xl">
        <ErrorMessage
          title="Erreur"
          message="Impossible de charger les détails de l'affaire."
          hint="Vérifiez que le backend est démarré."
        />
      </PageLayout>
    );
  }

  const remaining = affair.articleCount - affair.labeledCount;
  const pct = affair.articleCount > 0 ? (affair.labeledCount / affair.articleCount) * 100 : 0;

  // Build sentence summary parts
  const sentenceParts: string[] = [];
  if (affair.fineEur != null) {
    sentenceParts.push(`${affair.fineEur.toLocaleString('fr-FR')} € d'amende`);
  }
  if (affair.prisonMonths != null) {
    const label = affair.prisonSuspended ? `${affair.prisonMonths} mois (sursis)` : `${affair.prisonMonths} mois`;
    sentenceParts.push(label);
  }
  if (affair.ineligibilityMonths != null) {
    sentenceParts.push(`${affair.ineligibilityMonths} mois d'inéligibilité`);
  }

  return (
    <PageLayout maxWidth="6xl">
      {/* Back link */}
      <Link
        to="/projects/europressing/cases"
        className="inline-flex items-center gap-1 text-sm text-dawta-600 hover:text-dawta-700 mb-4"
      >
        <ArrowLeft className="w-4 h-4" /> Retour aux affaires
      </Link>

      <PageHeader
        title={affair.title}
        subtitle={affair.description || undefined}
      />

      {/* Affair metadata */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {affair.politicianName && (
          <span className="text-sm text-theme-primary font-medium">
            {affair.politicianName}
            {affair.politicianParty && (
              <span className="ml-1 text-theme-tertiary font-normal">({affair.politicianParty})</span>
            )}
          </span>
        )}
        {affair.category && <StatusBadge status={affair.category} />}
        {affair.severity && <StatusBadge status={affair.severity} variant="warning" />}
        {affair.status && <StatusBadge status={affair.status} variant="success" />}
        {affair.dateStart && (
          <span className="text-xs text-theme-tertiary">Début : {affair.dateStart}</span>
        )}
        {affair.dateFacts && (
          <span className="text-xs text-theme-tertiary">Faits : {affair.dateFacts}</span>
        )}
        {affair.dateVerdict && (
          <span className="text-xs text-theme-tertiary">Verdict : {affair.dateVerdict}</span>
        )}
        {affair.poligraphUrl && (
          <a
            href={affair.poligraphUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-dawta-600 hover:text-dawta-700 underline"
          >
            Poligraph
          </a>
        )}
        {sentenceParts.length > 0 && (
          <span className="text-xs text-theme-tertiary">Peine : {sentenceParts.join(' · ')}</span>
        )}
      </div>

      {/* Stats bar */}
      <div className="mb-6 space-y-3">
        <div className="grid grid-cols-3 gap-2">
          <div className="p-2 bg-green-50 rounded-lg text-center border border-green-100">
            <div className="text-lg font-bold text-green-600">{affair.labeledCount}</div>
            <div className="text-xs text-green-600/70">Labelisés</div>
          </div>
          <div className="p-2 bg-theme-secondary rounded-lg text-center">
            <div className="text-lg font-bold text-theme-primary">{remaining}</div>
            <div className="text-xs text-theme-tertiary">Restants</div>
          </div>
          <div className="p-2 bg-dawta-50 rounded-lg text-center border border-dawta-100">
            <div className="text-lg font-bold text-dawta-600">{affair.articleCount}</div>
            <div className="text-xs text-dawta-600/70">Total articles</div>
          </div>
        </div>
        <div className="max-w-md mx-auto">
          <div className="flex justify-between text-xs text-dawta-600 mb-1">
            <span>{affair.labeledCount} labelisés</span>
            <span>{pct.toFixed(1)}%</span>
          </div>
          <div className="h-2 bg-dawta-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <ChipGroup options={RELEVANCE_FILTERS} value={relevanceFilter} onChange={setRelevanceFilter} />
        <ChipGroup options={LABEL_FILTERS} value={labelFilter} onChange={setLabelFilter} />
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-tertiary" />
          <input
            type="text"
            placeholder="Rechercher titre ou source..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-sm rounded-lg border border-theme-light bg-theme-secondary text-theme-primary placeholder:text-theme-tertiary focus:outline-none focus:ring-2 focus:ring-dawta-400"
          />
        </div>
      </div>

      <p className="text-xs text-theme-tertiary mb-3">
        {filtered.length} article{filtered.length !== 1 ? 's' : ''}
      </p>

      {/* Article list */}
      <div className="space-y-2">
        {filtered.map((article) => (
          <ArticleRow
            key={article.articleId}
            article={article}
            isExpanded={expandedArticle === article.articleId}
            onToggleExpand={() =>
              setExpandedArticle((prev) => (prev === article.articleId ? null : article.articleId))
            }
            onLabel={(judgment) => handleLabel(article.articleId, judgment)}
            isSaving={labelMutation.isPending}
            notes={notesMap[article.articleId] ?? article.notes ?? ''}
            onNotesChange={(v) => setNotesMap((prev) => ({ ...prev, [article.articleId]: v }))}
            onNotesBlur={() => handleNotesBlur(article.articleId)}
          />
        ))}
      </div>

      {filtered.length === 0 && !isLoading && (
        <p className="text-center text-theme-tertiary py-12">
          Aucun article ne correspond aux filtres.
        </p>
      )}
    </PageLayout>
  );
}

function ArticleRow({
  article,
  isExpanded,
  onToggleExpand,
  onLabel,
  isSaving,
  notes,
  onNotesChange,
  onNotesBlur,
}: {
  article: EpArticleWithRelevance;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onLabel: (judgment: boolean | null) => void;
  isSaving: boolean;
  notes: string;
  onNotesChange: (v: string) => void;
  onNotesBlur: () => void;
}) {
  const judgmentColor =
    article.manualJudgment === true
      ? 'border-green-300 bg-green-50/30'
      : article.manualJudgment === false
      ? 'border-red-300 bg-red-50/30'
      : 'border-theme-light bg-theme-secondary';

  return (
    <div className={`rounded-lg border transition-all ${judgmentColor}`}>
      {/* Main row */}
      <div className="px-4 py-3">
        <div className="flex items-start gap-3">
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-medium text-theme-primary truncate">{article.title}</p>
            </div>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              {article.source && (
                <span className="text-xs text-theme-tertiary">{article.source}</span>
              )}
              {article.datePublished && (
                <span className="text-xs text-theme-tertiary">{article.datePublished}</span>
              )}
              <DaysBadge days={article.daysSinceCase} />
              <RelevanceBadge category={article.relevanceCategory} />
              {article.relevanceScore != null && (
                <span className="text-xs text-theme-tertiary font-mono">
                  {(article.relevanceScore * 100).toFixed(0)}%
                </span>
              )}
            </div>
          </div>

          {/* Labeling controls */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={() => onLabel(true)}
              disabled={isSaving}
              title="Pertinent"
              className={`p-1.5 rounded-md transition-colors ${
                article.manualJudgment === true
                  ? 'bg-green-500 text-white'
                  : 'bg-theme-secondary text-green-600 hover:bg-green-100'
              }`}
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={() => onLabel(false)}
              disabled={isSaving}
              title="Non pertinent"
              className={`p-1.5 rounded-md transition-colors ${
                article.manualJudgment === false
                  ? 'bg-red-500 text-white'
                  : 'bg-theme-secondary text-red-600 hover:bg-red-100'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
            {article.manualJudgment != null && (
              <button
                onClick={() => onLabel(null)}
                disabled={isSaving}
                title="Réinitialiser"
                className="p-1.5 rounded-md bg-theme-secondary text-theme-tertiary hover:bg-gray-200 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onToggleExpand}
              className="p-1.5 rounded-md bg-theme-secondary text-theme-tertiary hover:bg-dawta-100 transition-colors ml-1"
              title={isExpanded ? 'Réduire' : 'Voir le contenu'}
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Notes */}
        <div className="mt-2">
          <input
            type="text"
            placeholder="Notes..."
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            onBlur={onNotesBlur}
            className="w-full px-2 py-1 text-xs rounded border border-theme-light bg-white/50 text-theme-primary placeholder:text-theme-tertiary focus:outline-none focus:ring-1 focus:ring-dawta-300"
          />
        </div>
      </div>

      {/* Expandable content */}
      {isExpanded && article.contentText && (
        <div className="px-4 pb-3 border-t border-theme-light">
          <div
            className="prose prose-sm max-w-none mt-2 text-theme-primary"
            dangerouslySetInnerHTML={{ __html: article.contentText }}
          />
        </div>
      )}
    </div>
  );
}
