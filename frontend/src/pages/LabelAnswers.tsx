import { useState, useMemo, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Search,
  Keyboard,
} from 'lucide-react';
import {
  fetchAcceptedMatchesWithAnswers,
  fetchLabellingStats,
  saveAnswerAlignments,
  type MatchWithAnswers,
  type Alignment,
} from '../api/client';
import { PageHeader, LoadingState, PageLayout } from '../components';

/* ─── Constants ─── */

const ALIGNMENTS: { value: Alignment; label: string; color: string; activeColor: string; key: string }[] = [
  { value: 'aligned', label: 'Aligné', color: 'text-green-600', activeColor: 'bg-green-500 text-white ring-green-300', key: 'a' },
  { value: 'opposed', label: 'Opposé', color: 'text-red-600', activeColor: 'bg-red-500 text-white ring-red-300', key: 'z' },
  { value: 'neutral', label: 'Neutre', color: 'text-gray-600', activeColor: 'bg-gray-500 text-white ring-gray-300', key: 'e' },
  { value: 'unrelated', label: 'Non relié', color: 'text-slate-600', activeColor: 'bg-slate-500 text-white ring-slate-300', key: 'r' },
  { value: 'unknown', label: 'Ne sait pas', color: 'text-yellow-600', activeColor: 'bg-yellow-500 text-white ring-yellow-300', key: 't' },
];

const STATUS_FILTERS = [
  { value: '', label: 'Toutes' },
  { value: 'unlabelled', label: 'Non labelisées' },
  { value: 'partial', label: 'Partielles' },
  { value: 'complete', label: 'Complètes' },
] as const;

/* ─── Stats bar ─── */

function LabellingStatsBar({ stats }: { stats: { totalAccepted: number; labelled: number; remaining: number } }) {
  const pct = stats.totalAccepted > 0 ? (stats.labelled / stats.totalAccepted) * 100 : 0;

  return (
    <div className="mb-6 space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <div className="p-2 bg-green-50 rounded-lg text-center border border-green-100">
          <div className="text-lg font-bold text-green-600">{stats.labelled}</div>
          <div className="text-xs text-green-600/70">Labelisées</div>
        </div>
        <div className="p-2 bg-theme-secondary rounded-lg text-center">
          <div className="text-lg font-bold text-theme-primary">{stats.remaining}</div>
          <div className="text-xs text-theme-tertiary">Restantes</div>
        </div>
        <div className="p-2 bg-dawta-50 rounded-lg text-center border border-dawta-100">
          <div className="text-lg font-bold text-dawta-600">{stats.totalAccepted}</div>
          <div className="text-xs text-dawta-600/70">Total acceptées</div>
        </div>
      </div>
      <div className="max-w-md mx-auto">
        <div className="flex justify-between text-xs text-dawta-600 mb-1">
          <span>{stats.labelled} labelisées</span>
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
  );
}

/* ─── Chip group ─── */

function ChipGroup({
  label,
  options,
  value,
  onChange,
}: {
  label?: string;
  options: readonly { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-1.5">
      {label && (
        <span className="text-xs font-medium text-theme-tertiary uppercase tracking-wide">
          {label}
        </span>
      )}
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

/* ─── Focus-mode card: single pair labelling ─── */

function FocusCard({
  item,
  onSave,
  isSaving,
  onNext,
  onPrev,
  currentIndex,
  totalCount,
}: {
  item: MatchWithAnswers;
  onSave: (matchId: string, alignments: Record<string, Alignment>) => void;
  isSaving: boolean;
  onNext: () => void;
  onPrev: () => void;
  currentIndex: number;
  totalCount: number;
}) {
  const [localAlignments, setLocalAlignments] = useState<Record<string, Alignment>>(
    () => ({ ...item.alignments } as Record<string, Alignment>),
  );
  const [activeAnswerIndex, setActiveAnswerIndex] = useState(0);

  const answers = item.answers;
  const allLabelled = answers.length > 0 && answers.every((a) => localAlignments[a]);
  const hasChanges = JSON.stringify(localAlignments) !== JSON.stringify(item.alignments);

  const setAlignment = useCallback((answer: string, alignment: Alignment) => {
    setLocalAlignments((prev) => ({ ...prev, [answer]: alignment }));
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't capture when typing in search
      if ((e.target as HTMLElement)?.tagName === 'INPUT') return;

      const currentAnswer = answers[activeAnswerIndex];

      const advance = () => { if (activeAnswerIndex < answers.length - 1) setActiveAnswerIndex((i) => i + 1); };

      if (e.key === 'a' && currentAnswer) {
        setAlignment(currentAnswer, 'aligned'); advance();
      } else if (e.key === 'z' && currentAnswer) {
        setAlignment(currentAnswer, 'opposed'); advance();
      } else if (e.key === 'e' && currentAnswer) {
        setAlignment(currentAnswer, 'neutral'); advance();
      } else if (e.key === 'r' && currentAnswer) {
        setAlignment(currentAnswer, 'unrelated'); advance();
      } else if (e.key === 't' && currentAnswer) {
        setAlignment(currentAnswer, 'unknown'); advance();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveAnswerIndex((i) => Math.max(0, i - 1));
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveAnswerIndex((i) => Math.min(answers.length - 1, i + 1));
      } else if (e.key === 'ArrowRight' || e.key === 'n') {
        onNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'p') {
        onPrev();
      } else if (e.key === 'Enter' && hasChanges) {
        onSave(item.match.matchId, localAlignments);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [answers, activeAnswerIndex, localAlignments, hasChanges, item.match.matchId, onSave, onNext, onPrev, setAlignment]);

  return (
    <div className="space-y-4">
      {/* Navigation bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onPrev}
          disabled={currentIndex === 0}
          className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg bg-theme-secondary text-theme-tertiary hover:bg-dawta-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Préc.
        </button>
        <span className="text-sm text-theme-tertiary font-medium">
          {currentIndex + 1} / {totalCount}
        </span>
        <button
          onClick={onNext}
          disabled={currentIndex === totalCount - 1}
          className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg bg-theme-secondary text-theme-tertiary hover:bg-dawta-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          Suiv. <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Main card */}
      <div className="border border-theme-light rounded-xl overflow-hidden bg-theme-secondary/30">
        {/* Question & Vote context */}
        <div className="p-5 space-y-4 border-b border-theme-light">
          <div>
            <div className="text-xs font-semibold text-dawta-600 uppercase tracking-wide mb-1.5">
              Question de sondage
            </div>
            <p className="text-theme-primary text-base leading-relaxed">
              {item.match.questionClean || item.match.questionOriginal || '—'}
            </p>
            {item.match.surveyFile && (
              <p className="text-xs text-theme-tertiary mt-1">
                {item.match.surveyFile?.replace('.xlsx', '')}
                {item.match.surveyDate && ` — ${item.match.surveyDate}`}
              </p>
            )}
          </div>
          <div>
            <div className="text-xs font-semibold text-bordeaux uppercase tracking-wide mb-1.5">
              Vote du Parlement Européen
            </div>
            <p className="text-theme-primary text-base leading-relaxed">
              {item.match.voteSummaryClean || item.match.voteSummaryOriginal || '—'}
            </p>
            {item.match.voteDate && (
              <p className="text-xs text-theme-tertiary mt-1">
                Vote : {item.match.voteDate}
              </p>
            )}
          </div>
        </div>

        {/* Answer labelling */}
        <div className="p-5">
          <div className="text-xs font-semibold text-theme-primary uppercase tracking-wide mb-3">
            Réponses du sondage — Labelisez chaque réponse
          </div>

          {answers.length === 0 ? (
            <p className="text-sm text-theme-tertiary italic py-4 text-center">
              Aucune réponse trouvée pour cette question dans les données de sondage.
            </p>
          ) : (
            <div className="space-y-2">
              {/* Header row */}
              <div className="hidden sm:grid sm:grid-cols-[1fr_repeat(5,80px)] gap-1 px-2 pb-1">
                <div className="text-xs text-theme-tertiary">Réponse</div>
                {ALIGNMENTS.map((a) => (
                  <div key={a.value} className="text-xs text-theme-tertiary text-center">
                    {a.label} <span className="opacity-50">({a.key})</span>
                  </div>
                ))}
              </div>

              {answers.map((answer, idx) => {
                const currentAlignment = localAlignments[answer];
                const isActive = idx === activeAnswerIndex;

                return (
                  <div
                    key={answer}
                    onClick={() => setActiveAnswerIndex(idx)}
                    className={`grid grid-cols-1 sm:grid-cols-[1fr_repeat(5,80px)] gap-1 items-center px-3 py-2.5 rounded-lg transition-all cursor-pointer ${
                      isActive
                        ? 'bg-dawta-50 ring-2 ring-dawta-300'
                        : currentAlignment
                        ? 'bg-green-50/50'
                        : 'bg-theme-secondary hover:bg-theme-secondary/80'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {currentAlignment && (
                        <Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                      )}
                      <span className={`text-sm font-medium ${currentAlignment ? 'text-theme-primary' : 'text-theme-primary'}`}>
                        {answer}
                      </span>
                    </div>

                    <div className="flex sm:contents gap-1 mt-1 sm:mt-0">
                      {ALIGNMENTS.map((a) => (
                        <button
                          key={a.value}
                          onClick={(e) => {
                            e.stopPropagation();
                            setAlignment(answer, a.value);
                            if (idx === activeAnswerIndex && activeAnswerIndex < answers.length - 1) {
                              setActiveAnswerIndex((i) => i + 1);
                            }
                          }}
                          className={`px-2 py-1.5 text-xs font-medium rounded-md transition-all ${
                            currentAlignment === a.value
                              ? `${a.activeColor} ring-2 shadow-sm`
                              : `bg-theme-secondary/80 ${a.color} hover:opacity-80 border border-transparent hover:border-current/20`
                          }`}
                        >
                          <span className="sm:hidden">{a.label}</span>
                          <span className="hidden sm:inline">{a.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Save bar */}
        <div className="px-5 py-3 border-t border-theme-light bg-theme-secondary/50 flex items-center justify-between">
          <div className="text-xs text-theme-tertiary">
            {Object.keys(localAlignments).length}/{answers.length} réponses labelisées
            {allLabelled && <span className="ml-2 text-green-600 font-medium">Complet</span>}
          </div>
          <button
            onClick={() => onSave(item.match.matchId, localAlignments)}
            disabled={!hasChanges || isSaving}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              hasChanges && !isSaving
                ? 'bg-dawta-600 text-white hover:bg-dawta-700 shadow-sm'
                : 'bg-theme-secondary text-theme-tertiary cursor-not-allowed'
            }`}
          >
            {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── List view row ─── */

function MatchListItem({
  item,
  onClick,
  isSelected,
}: {
  item: MatchWithAnswers;
  onClick: () => void;
  isSelected: boolean;
}) {
  const labelledCount = Object.keys(item.alignments).length;
  const totalAnswers = item.answers.length;
  const isComplete = totalAnswers > 0 && labelledCount >= totalAnswers;
  const hasNoAnswers = totalAnswers === 0;

  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
        isSelected
          ? 'border-dawta-400 bg-dawta-50 ring-2 ring-dawta-200'
          : isComplete
          ? 'border-green-200 bg-green-50/30 hover:bg-green-50/60'
          : hasNoAnswers
          ? 'border-theme-light bg-theme-secondary/30 opacity-50'
          : 'border-theme-light bg-theme-secondary hover:bg-theme-secondary/80'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-theme-primary truncate">
            {item.match.questionClean || item.match.questionOriginal || '—'}
          </p>
          <p className="text-xs text-theme-tertiary truncate mt-0.5">
            {item.match.voteSummaryClean || item.match.voteSummaryOriginal || '—'}
          </p>
        </div>
        <div className="flex-shrink-0 text-right">
          {hasNoAnswers ? (
            <span className="text-xs text-theme-tertiary">Pas de réponses</span>
          ) : (
            <span className={`text-xs font-medium ${isComplete ? 'text-green-600' : 'text-theme-tertiary'}`}>
              {labelledCount}/{totalAnswers}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

/* ─── Main page ─── */

export default function LabelAnswers() {
  const [statusFilter, setStatusFilter] = useState('unlabelled');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const queryClient = useQueryClient();

  const { data: matchesWithAnswers = [], isLoading } = useQuery({
    queryKey: ['matchesWithAnswers'],
    queryFn: fetchAcceptedMatchesWithAnswers,
  });

  const { data: stats } = useQuery({
    queryKey: ['labellingStats'],
    queryFn: fetchLabellingStats,
  });

  const saveMutation = useMutation({
    mutationFn: ({ matchId, alignments }: { matchId: string; alignments: Record<string, Alignment> }) =>
      saveAnswerAlignments(
        matchId,
        Object.entries(alignments).map(([answerLabel, alignment]) => ({
          answerLabel,
          alignment,
        })),
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matchesWithAnswers'] });
      queryClient.invalidateQueries({ queryKey: ['labellingStats'] });
    },
  });

  const handleSave = useCallback(
    (matchId: string, alignments: Record<string, Alignment>) => {
      saveMutation.mutate({ matchId, alignments });
    },
    [saveMutation],
  );

  // Filter matches
  const filtered = useMemo(() => {
    let result = matchesWithAnswers;

    // Only show matches that have answers
    result = result.filter((m) => m.answers.length > 0);

    if (statusFilter === 'unlabelled') {
      result = result.filter((m) => Object.keys(m.alignments).length === 0);
    } else if (statusFilter === 'partial') {
      result = result.filter(
        (m) => Object.keys(m.alignments).length > 0 && Object.keys(m.alignments).length < m.answers.length,
      );
    } else if (statusFilter === 'complete') {
      result = result.filter(
        (m) => m.answers.length > 0 && Object.keys(m.alignments).length >= m.answers.length,
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (m) =>
          m.match.questionClean?.toLowerCase().includes(q) ||
          m.match.questionOriginal?.toLowerCase().includes(q) ||
          m.match.voteSummaryClean?.toLowerCase().includes(q) ||
          m.match.voteSummaryOriginal?.toLowerCase().includes(q),
      );
    }

    return result;
  }, [matchesWithAnswers, statusFilter, searchQuery]);

  const effectiveIndex = filtered.length === 0 ? 0 : Math.min(selectedIndex, filtered.length - 1);
  const currentItem = filtered[effectiveIndex];

  const handleNext = useCallback(() => {
    setSelectedIndex((i) => Math.min(filtered.length - 1, i + 1));
  }, [filtered.length]);

  const handlePrev = useCallback(() => {
    setSelectedIndex((i) => Math.max(0, i - 1));
  }, []);

  return (
    <PageLayout maxWidth="6xl">
      <PageHeader
        title="Labelisation des réponses"
        subtitle="Pour chaque paire acceptée, classez si les réponses au sondage sont alignées ou opposées au vote du Parlement"
      />

      {stats && <LabellingStatsBar stats={stats} />}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <ChipGroup label="Statut" options={STATUS_FILTERS} value={statusFilter} onChange={setStatusFilter} />
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-tertiary" />
          <input
            type="text"
            placeholder="Rechercher question ou vote..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-sm rounded-lg border border-theme-light bg-theme-secondary text-theme-primary placeholder:text-theme-tertiary focus:outline-none focus:ring-2 focus:ring-dawta-400"
          />
        </div>
        <button
          onClick={() => setShowShortcuts(!showShortcuts)}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition-colors ${
            showShortcuts ? 'bg-dawta-600 text-white' : 'bg-theme-secondary text-theme-tertiary hover:bg-dawta-100'
          }`}
        >
          <Keyboard className="w-4 h-4" />
          <span className="hidden sm:inline">Raccourcis</span>
        </button>
      </div>

      {/* Keyboard shortcuts help */}
      {showShortcuts && (
        <div className="mb-4 p-3 bg-dawta-50 border border-dawta-200 rounded-lg text-sm space-y-1">
          <div className="font-medium text-dawta-700 mb-2">Raccourcis clavier</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-1 text-theme-primary">
            <div><kbd className="px-1.5 py-0.5 bg-white rounded border text-xs font-mono">a</kbd> Aligné</div>
            <div><kbd className="px-1.5 py-0.5 bg-white rounded border text-xs font-mono">z</kbd> Opposé</div>
            <div><kbd className="px-1.5 py-0.5 bg-white rounded border text-xs font-mono">e</kbd> Neutre</div>
            <div><kbd className="px-1.5 py-0.5 bg-white rounded border text-xs font-mono">r</kbd> Non relié</div>
            <div><kbd className="px-1.5 py-0.5 bg-white rounded border text-xs font-mono">t</kbd> Ne sait pas</div>
            <div><kbd className="px-1.5 py-0.5 bg-white rounded border text-xs font-mono">&uarr;&darr;</kbd> Naviguer réponses</div>
            <div><kbd className="px-1.5 py-0.5 bg-white rounded border text-xs font-mono">&larr;&rarr;</kbd> Paire préc./suiv.</div>
            <div><kbd className="px-1.5 py-0.5 bg-white rounded border text-xs font-mono">Enter</kbd> Sauvegarder</div>
          </div>
        </div>
      )}

      <p className="text-xs text-theme-tertiary mb-3">
        {filtered.length} paire{filtered.length !== 1 ? 's' : ''} à labeliser
      </p>

      {isLoading && <LoadingState message="Chargement des paires acceptées..." />}

      {!isLoading && filtered.length === 0 && (
        <p className="text-center text-theme-tertiary py-12">
          Aucune paire ne correspond aux filtres.
        </p>
      )}

      {/* Split layout: list + focus card */}
      {!isLoading && filtered.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4">
          {/* Left: scrollable list */}
          <div className="lg:max-h-[calc(100vh-200px)] lg:overflow-y-auto space-y-1.5 pr-1">
            {filtered.map((item, idx) => (
              <MatchListItem
                key={item.match.matchId}
                item={item}
                isSelected={idx === effectiveIndex}
                onClick={() => setSelectedIndex(idx)}
              />
            ))}
          </div>

          {/* Right: focus card */}
          <div className="lg:sticky lg:top-4 lg:self-start">
            {currentItem && (
              <FocusCard
                key={currentItem.match.matchId}
                item={currentItem}
                onSave={handleSave}
                isSaving={saveMutation.isPending}
                onNext={handleNext}
                onPrev={handlePrev}
                currentIndex={effectiveIndex}
                totalCount={filtered.length}
              />
            )}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="mt-6 p-3 bg-theme-secondary/20 rounded-lg border border-theme-light/50">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
          {ALIGNMENTS.map((a) => (
            <div key={a.value} className="flex items-center gap-2">
              <span className={`inline-block w-3 h-3 rounded-full ${a.activeColor.split(' ')[0]}`} />
              <span className="text-theme-secondary">
                <span className={`font-medium ${a.color}`}>{a.label}</span>
                {a.value === 'aligned' && ' = la réponse va dans le sens du vote'}
                {a.value === 'opposed' && ' = la réponse va contre le vote'}
                {a.value === 'neutral' && " = pas de lien direct (ex: 'ne sait pas')"}
                {a.value === 'unknown' && ' = impossible de déterminer'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
