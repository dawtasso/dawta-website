import { useState, useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronRight,
  Search,
  RotateCcw,
} from 'lucide-react';
import {
  fetchAllMatches,
  fetchValidationStats,
  validateMatch,
  clearMatchValidation,
  type SurveyVoteMatch,
  type ValidationStats,
} from '../api/client';
import { PageHeader, LoadingState, PageLayout } from '../components';

/* ─── Filter constants ─── */

const SOURCE_OPTIONS = [
  { value: '', label: 'Tous' },
  { value: 'Eurobarometer', label: 'Eurobaromètre' },
  { value: 'ESS', label: 'ESS' },
] as const;

const STATUS_OPTIONS = [
  { value: '', label: 'Toutes' },
  { value: 'pending', label: 'En attente' },
  { value: 'accepted', label: 'Acceptées' },
  { value: 'refused', label: 'Refusées' },
] as const;

/* ─── Chip group (shared between source & status) ─── */

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

/* ─── Stats bar (reused from before) ─── */

function StatsBar({ stats }: { stats: ValidationStats }) {
  const pctComplete =
    stats.total > 0 ? ((stats.accepted + stats.refused) / stats.total) * 100 : 0;

  return (
    <div className="mb-6 space-y-3">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="p-2 bg-green-50 rounded-lg text-center border border-green-100">
          <div className="text-lg font-bold text-green-600">{stats.accepted}</div>
          <div className="text-xs text-green-600/70">Acceptées</div>
        </div>
        <div className="p-2 bg-red-50 rounded-lg text-center border border-red-100">
          <div className="text-lg font-bold text-red-600">{stats.refused}</div>
          <div className="text-xs text-red-600/70">Refusées</div>
        </div>
        <div className="p-2 bg-theme-secondary rounded-lg text-center">
          <div className="text-lg font-bold text-theme-primary">{stats.pending}</div>
          <div className="text-xs text-theme-tertiary">En attente</div>
        </div>
        <div className="p-2 bg-dawta-50 rounded-lg text-center border border-dawta-100">
          <div className="text-lg font-bold text-dawta-600">{stats.total}</div>
          <div className="text-xs text-dawta-600/70">Total</div>
        </div>
      </div>

      <div className="max-w-md mx-auto">
        <div className="flex justify-between text-xs text-dawta-600 mb-1">
          <span>{stats.accepted + stats.refused} validées</span>
          <span>{pctComplete.toFixed(1)}%</span>
        </div>
        <div className="h-2 bg-dawta-200 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-500 flex">
            <div
              className="h-full bg-green-500 transition-all duration-500"
              style={{
                width: stats.total > 0 ? `${(stats.accepted / stats.total) * 100}%` : '0%',
              }}
            />
            <div
              className="h-full bg-red-400 transition-all duration-500"
              style={{
                width: stats.total > 0 ? `${(stats.refused / stats.total) * 100}%` : '0%',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Small helpers ─── */

function SourceBadge({ source }: { source?: string }) {
  if (!source) return null;
  const isESS = source === 'ESS';
  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide ${
        isESS ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
      }`}
    >
      {source}
    </span>
  );
}

function StatusDot({ adminValidated }: { adminValidated?: boolean | null }) {
  if (adminValidated === true)
    return <span className="w-2.5 h-2.5 rounded-full bg-green-500 flex-shrink-0" title="Acceptée" />;
  if (adminValidated === false)
    return <span className="w-2.5 h-2.5 rounded-full bg-red-500 flex-shrink-0" title="Refusée" />;
  return <span className="w-2.5 h-2.5 rounded-full bg-gray-300 flex-shrink-0" title="En attente" />;
}

function LlmBadge({ llmRelated }: { llmRelated?: boolean | null }) {
  if (llmRelated == null) return null;
  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${
        llmRelated ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
      }`}
    >
      LLM: {llmRelated ? 'Lié' : 'Non lié'}
    </span>
  );
}

/* ─── Types for grouped data ─── */

type GroupBy = 'question' | 'vote';

interface MatchGroup {
  groupId: string;
  groupLabel: string;
  groupSublabel?: string;
  source?: string;
  matches: SurveyVoteMatch[];
  classifiedCount: number;
  topSimilarity: number;
}

/* ─── Match row ─── */

function MatchRow({
  match,
  isExpanded,
  onToggle,
  onClassify,
  isSubmitting,
  groupBy,
}: {
  match: SurveyVoteMatch;
  isExpanded: boolean;
  onToggle: () => void;
  onClassify: (matchId: string, validated: boolean | null) => void;
  isSubmitting: boolean;
  groupBy: GroupBy;
}) {
  const similarityPercent = Math.round((Number(match.similarityScore) || 0) * 100);

  return (
    <div
      className={`border rounded-lg transition-colors ${
        match.adminValidated === true
          ? 'border-green-200 bg-green-50/50'
          : match.adminValidated === false
          ? 'border-red-200 bg-red-50/50'
          : 'border-theme-light bg-theme-secondary'
      }`}
    >
      {/* Row summary */}
      <div className="flex items-center gap-3 px-3 py-2">
        <StatusDot adminValidated={match.adminValidated} />

        <button
          onClick={onToggle}
          className="flex-1 min-w-0 text-left"
        >
          <div className="flex items-center gap-2 text-sm">
            <span className="truncate text-theme-primary font-medium">
              {groupBy === 'question'
                ? match.voteSummaryClean || match.voteSummaryOriginal || '—'
                : match.questionClean || match.questionOriginal || '—'}
            </span>
          </div>
        </button>

        {/* Similarity bar */}
        <div className="hidden sm:flex items-center gap-2 w-32 flex-shrink-0">
          <div className="flex-1 h-1.5 bg-theme-tertiary/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-dawta-500 rounded-full"
              style={{ width: `${similarityPercent}%` }}
            />
          </div>
          <span className="text-xs text-theme-tertiary w-8 text-right">{similarityPercent}%</span>
        </div>

        {match.daysBetween != null && (
          <span className="hidden md:inline text-xs text-theme-tertiary flex-shrink-0 w-16 text-right">
            {match.daysBetween}j
          </span>
        )}

        <LlmBadge llmRelated={match.llmRelated} />

        {/* Classification buttons */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClassify(match.matchId, true);
            }}
            disabled={isSubmitting}
            className={`p-1.5 rounded-md transition-colors ${
              match.adminValidated === true
                ? 'bg-green-500 text-white'
                : 'text-green-600 hover:bg-green-100'
            }`}
            title="Accepter"
          >
            <CheckCircle className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClassify(match.matchId, false);
            }}
            disabled={isSubmitting}
            className={`p-1.5 rounded-md transition-colors ${
              match.adminValidated === false
                ? 'bg-red-500 text-white'
                : 'text-red-600 hover:bg-red-100'
            }`}
            title="Refuser"
          >
            <XCircle className="w-4 h-4" />
          </button>
          {match.adminValidated != null && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClassify(match.matchId, null);
              }}
              disabled={isSubmitting}
              className="p-1.5 rounded-md text-gray-400 hover:bg-gray-100 transition-colors"
              title="Remettre en attente"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Expanded detail */}
      {isExpanded && (
        <div className="px-4 pb-3 pt-1 border-t border-theme-light/50 space-y-3 text-sm">
          <div>
            <div className="text-xs font-semibold text-dawta-600 uppercase tracking-wide mb-1">
              Question de sondage
            </div>
            <p className="text-theme-primary">{match.questionClean}</p>
            {match.questionOriginal && match.questionOriginal !== match.questionClean && (
              <p className="text-theme-tertiary text-xs italic mt-1">{match.questionOriginal}</p>
            )}
            {match.surveyDate && (
              <p className="text-theme-tertiary text-xs mt-1">
                {match.surveyFile?.replace('.xlsx', '')} — {match.surveyDate}
              </p>
            )}
          </div>

          <div>
            <div className="text-xs font-semibold text-bordeaux uppercase tracking-wide mb-1">
              Vote du Parlement Européen
            </div>
            <p className="text-theme-primary">{match.voteSummaryClean}</p>
            {match.voteSummaryOriginal && match.voteSummaryOriginal !== match.voteSummaryClean && (
              <p className="text-theme-tertiary text-xs italic mt-1">
                {match.voteSummaryOriginal}
              </p>
            )}
            {match.voteDate && (
              <p className="text-theme-tertiary text-xs mt-1">
                Vote : {match.voteDate}
                {match.daysBetween != null && (
                  <span className="ml-2">({match.daysBetween} jours d'écart)</span>
                )}
              </p>
            )}
          </div>

          {/* Similarity + LLM */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-theme-tertiary w-24">Similarité :</span>
              <div className="flex-1 h-2 bg-theme-tertiary/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-dawta-500 rounded-full"
                  style={{ width: `${similarityPercent}%` }}
                />
              </div>
              <span className="text-xs text-theme-tertiary w-10 text-right">
                {similarityPercent}%
              </span>
            </div>
            {match.llmExplanation && (
              <div>
                <span className="text-xs text-theme-tertiary">Explication LLM : </span>
                <span className="text-xs text-theme-secondary italic">{match.llmExplanation}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Question group ─── */

function QuestionGroup({
  group,
  expandedMatches,
  onToggleMatch,
  onClassify,
  submittingId,
  groupBy,
}: {
  group: MatchGroup;
  expandedMatches: Set<string>;
  onToggleMatch: (id: string) => void;
  onClassify: (matchId: string, validated: boolean | null) => void;
  submittingId: string | null;
  groupBy: GroupBy;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const isComplete = group.classifiedCount === group.matches.length;

  return (
    <div
      className={`border rounded-xl overflow-hidden transition-colors ${
        isComplete ? 'border-green-200' : 'border-theme-light'
      }`}
    >
      {/* Group header */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className={`w-full flex items-center gap-3 px-4 py-3 transition-colors text-left ${
          isComplete
            ? 'bg-green-50/60 hover:bg-green-50'
            : 'bg-theme-secondary/50 hover:bg-theme-secondary'
        }`}
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4 text-theme-tertiary flex-shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-theme-tertiary flex-shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {groupBy === 'question' && <SourceBadge source={group.source} />}
            <span
              className={`text-sm font-medium truncate ${
                isComplete ? 'text-green-700' : 'text-theme-primary'
              }`}
            >
              {group.groupLabel}
            </span>
          </div>
        </div>
        <span
          className={`text-xs flex-shrink-0 flex items-center gap-1.5 ${
            isComplete ? 'text-green-600 font-medium' : 'text-theme-tertiary'
          }`}
        >
          {isComplete && <CheckCircle className="w-3.5 h-3.5" />}
          {group.classifiedCount}/{group.matches.length}
        </span>
      </button>

      {/* Pair rows */}
      {!collapsed && (
        <div className="p-2 space-y-1.5">
          {group.matches.map((m) => (
            <MatchRow
              key={m.matchId}
              match={m}
              isExpanded={expandedMatches.has(m.matchId)}
              onToggle={() => onToggleMatch(m.matchId)}
              onClassify={onClassify}
              isSubmitting={submittingId === m.matchId}
              groupBy={groupBy}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Main page ─── */

export default function JudgeSurveyVote() {
  const [groupBy, setGroupBy] = useState<GroupBy>('question');
  const [sourceFilter, setSourceFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedMatches, setExpandedMatches] = useState<Set<string>>(new Set());
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const {
    data: allMatches = [],
    isLoading,
  } = useQuery({
    queryKey: ['allMatches'],
    queryFn: () => fetchAllMatches(),
  });

  const { data: stats } = useQuery({
    queryKey: ['validationStats'],
    queryFn: fetchValidationStats,
  });

  const validateMutation = useMutation({
    mutationFn: ({ matchId, validated }: { matchId: string; validated: boolean }) =>
      validateMatch(matchId, validated),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allMatches'] });
      queryClient.invalidateQueries({ queryKey: ['validationStats'] });
    },
  });

  const clearMutation = useMutation({
    mutationFn: (matchId: string) => clearMatchValidation(matchId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allMatches'] });
      queryClient.invalidateQueries({ queryKey: ['validationStats'] });
    },
  });

  const handleClassify = useCallback(
    (matchId: string, validated: boolean | null) => {
      setSubmittingId(matchId);
      if (validated === null) {
        clearMutation.mutate(matchId, {
          onSettled: () => setSubmittingId(null),
        });
      } else {
        validateMutation.mutate(
          { matchId, validated },
          { onSettled: () => setSubmittingId(null) },
        );
      }
    },
    [validateMutation, clearMutation],
  );

  const toggleMatchExpanded = useCallback((id: string) => {
    setExpandedMatches((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  // Client-side filtering
  const filteredMatches = useMemo(() => {
    let result = allMatches;

    if (sourceFilter) {
      result = result.filter((m) => m.source === sourceFilter);
    }

    if (statusFilter === 'pending') {
      result = result.filter((m) => m.adminValidated == null);
    } else if (statusFilter === 'accepted') {
      result = result.filter((m) => m.adminValidated === true);
    } else if (statusFilter === 'refused') {
      result = result.filter((m) => m.adminValidated === false);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (m) =>
          (m.questionClean?.toLowerCase().includes(q)) ||
          (m.questionOriginal?.toLowerCase().includes(q)) ||
          (m.voteSummaryClean?.toLowerCase().includes(q)) ||
          (m.voteSummaryOriginal?.toLowerCase().includes(q)),
      );
    }

    return result;
  }, [allMatches, sourceFilter, statusFilter, searchQuery]);

  // Group by question or by vote, sorted by top similarity
  const groups = useMemo(() => {
    const map = new Map<string, MatchGroup>();

    for (const m of filteredMatches) {
      const key =
        groupBy === 'question'
          ? m.questionId || m.matchId
          : String(m.voteId ?? m.matchId);

      if (!map.has(key)) {
        map.set(key, {
          groupId: key,
          groupLabel:
            groupBy === 'question'
              ? m.questionClean || '(question inconnue)'
              : m.voteSummaryClean || m.voteSummaryOriginal || '(vote inconnu)',
          groupSublabel:
            groupBy === 'question' ? m.questionOriginal : m.voteSummaryOriginal,
          source: m.source,
          matches: [],
          classifiedCount: 0,
          topSimilarity: 0,
        });
      }
      const group = map.get(key)!;
      group.matches.push(m);
      if (m.adminValidated != null) group.classifiedCount++;
      const sim = Number(m.similarityScore) || 0;
      if (sim > group.topSimilarity) group.topSimilarity = sim;
    }

    // Sort matches within each group by similarity DESC
    for (const group of map.values()) {
      group.matches.sort(
        (a, b) => (Number(b.similarityScore) || 0) - (Number(a.similarityScore) || 0),
      );
    }

    // Sort groups by their top similarity DESC
    return Array.from(map.values()).sort((a, b) => b.topSimilarity - a.topSimilarity);
  }, [filteredMatches, groupBy]);

  return (
    <PageLayout maxWidth="4xl">
      <PageHeader
        title="Validation des paires sondage-vote"
        subtitle="Acceptez ou refusez les correspondances"
      />

      {stats && <StatsBar stats={stats} />}

      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        {/* Group-by toggle */}
        <div className="flex items-center bg-theme-secondary rounded-lg p-0.5 border border-theme-light">
          <button
            onClick={() => setGroupBy('question')}
            className={`px-3 py-1.5 text-sm rounded-md font-medium transition-colors ${
              groupBy === 'question'
                ? 'bg-dawta-600 text-white shadow-sm'
                : 'text-theme-tertiary hover:text-theme-primary'
            }`}
          >
            Par question
          </button>
          <button
            onClick={() => {
              setGroupBy('vote');
              setSourceFilter('');
            }}
            className={`px-3 py-1.5 text-sm rounded-md font-medium transition-colors ${
              groupBy === 'vote'
                ? 'bg-dawta-600 text-white shadow-sm'
                : 'text-theme-tertiary hover:text-theme-primary'
            }`}
          >
            Par vote
          </button>
        </div>

        {groupBy === 'question' && (
          <ChipGroup label="Source" options={SOURCE_OPTIONS} value={sourceFilter} onChange={setSourceFilter} />
        )}
        <ChipGroup label="Statut" options={STATUS_OPTIONS} value={statusFilter} onChange={setStatusFilter} />
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
      </div>

      {/* Count */}
      <p className="text-xs text-theme-tertiary mb-3">
        {filteredMatches.length} paire{filteredMatches.length !== 1 ? 's' : ''} — {groups.length}{' '}
        {groupBy === 'question'
          ? `question${groups.length !== 1 ? 's' : ''}`
          : `vote${groups.length !== 1 ? 's' : ''}`}
      </p>

      {isLoading && <LoadingState message="Chargement des paires..." />}

      {/* Grouped list */}
      {!isLoading && (
        <div className="space-y-4">
          {groups.map((group) => (
            <QuestionGroup
              key={group.groupId}
              group={group}
              expandedMatches={expandedMatches}
              onToggleMatch={toggleMatchExpanded}
              onClassify={handleClassify}
              submittingId={submittingId}
              groupBy={groupBy}
            />
          ))}
          {groups.length === 0 && !isLoading && (
            <p className="text-center text-theme-tertiary py-8">
              Aucune paire ne correspond aux filtres.
            </p>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="mt-6 p-3 bg-theme-secondary/20 rounded-lg border border-theme-light/50">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-theme-secondary">
              <span className="text-green-600 font-medium">Acceptée</span> = paire pertinente
            </span>
          </div>
          <div className="flex items-center gap-2">
            <XCircle className="w-4 h-4 text-red-500" />
            <span className="text-theme-secondary">
              <span className="text-red-600 font-medium">Refusée</span> = pas de lien
            </span>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
