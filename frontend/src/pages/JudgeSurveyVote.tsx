import { useState, useCallback, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckCircle, XCircle, Database, Lock, Unlock, Filter, X } from 'lucide-react';
import {
  fetchRandomMatch,
  fetchValidationStats,
  fetchValidatedMatches,
  validateMatch,
  type SurveyVoteMatch,
  type ValidationStats,
} from '../api/client';
import {
  PageHeader,
  LoadingState,
  PageLayout,
  SwipeCard,
} from '../components';

const ADMIN_KEY = 'dawta_admin';
const CLICK_THRESHOLD = 5;
const CLICK_WINDOW_MS = 2000;

const SOURCE_OPTIONS = [
  { value: '', label: 'Tous' },
  { value: 'Eurobarometer', label: 'Eurobaromètre' },
  { value: 'ESS', label: 'ESS' },
] as const;

function useAdminMode() {
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem(ADMIN_KEY) === 'true');
  const clickTimestamps = useRef<number[]>([]);

  const handleTitleClick = useCallback(() => {
    const now = Date.now();
    clickTimestamps.current.push(now);
    clickTimestamps.current = clickTimestamps.current.filter(
      (t) => now - t < CLICK_WINDOW_MS,
    );
    if (clickTimestamps.current.length >= CLICK_THRESHOLD) {
      clickTimestamps.current = [];
      setIsAdmin((prev) => {
        const next = !prev;
        if (next) {
          localStorage.setItem(ADMIN_KEY, 'true');
        } else {
          localStorage.removeItem(ADMIN_KEY);
        }
        return next;
      });
    }
  }, []);

  return { isAdmin, handleTitleClick };
}

function SourceFilter({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center justify-center gap-1 mb-4">
      {SOURCE_OPTIONS.map((opt) => (
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

function StatsBar({ stats }: { stats: ValidationStats }) {
  const pctComplete = stats.total > 0 ? ((stats.accepted + stats.refused) / stats.total) * 100 : 0;

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

      {/* Progress bar */}
      <div className="max-w-md mx-auto">
        <div className="flex justify-between text-xs text-dawta-600 mb-1">
          <span>{stats.accepted + stats.refused} validées</span>
          <span>{pctComplete.toFixed(1)}%</span>
        </div>
        <div className="h-2 bg-dawta-200 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-500 flex">
            <div
              className="h-full bg-green-500 transition-all duration-500"
              style={{ width: stats.total > 0 ? `${(stats.accepted / stats.total) * 100}%` : '0%' }}
            />
            <div
              className="h-full bg-red-400 transition-all duration-500"
              style={{ width: stats.total > 0 ? `${(stats.refused / stats.total) * 100}%` : '0%' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function SourceBadge({ source }: { source?: string }) {
  if (!source) return null;
  const isESS = source === 'ESS';
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide ${
      isESS
        ? 'bg-purple-100 text-purple-700'
        : 'bg-blue-100 text-blue-700'
    }`}>
      {source}
    </span>
  );
}

function MatchDetailModal({ match, onClose }: { match: SurveyVoteMatch; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const similarityPercent = Math.round((Number(match.similarityScore) || 0) * 100);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-theme-secondary rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-theme-light">
          <div className="flex items-center gap-2">
            <SourceBadge source={match.source} />
            {match.adminValidated === true ? (
              <span className="flex items-center gap-1 text-xs font-medium text-green-600">
                <CheckCircle className="w-3.5 h-3.5" /> Acceptée
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs font-medium text-red-600">
                <XCircle className="w-3.5 h-3.5" /> Refusée
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-theme-tertiary hover:text-theme-primary hover:bg-theme-tertiary/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Survey question */}
          <div>
            <div className="text-xs font-semibold text-dawta-600 uppercase tracking-wide mb-1.5">
              Question de sondage
            </div>
            <p className="text-theme-primary text-sm leading-relaxed">{match.questionClean}</p>
            {match.questionOriginal && match.questionOriginal !== match.questionClean && (
              <p className="text-theme-tertiary text-xs italic mt-1">{match.questionOriginal}</p>
            )}
            {match.surveyDate && (
              <p className="text-theme-tertiary text-xs mt-1">
                {match.surveyFile?.replace('.xlsx', '')} — {match.surveyDate}
              </p>
            )}
          </div>

          <div className="border-t border-theme-light" />

          {/* Vote */}
          <div>
            <div className="text-xs font-semibold text-bordeaux uppercase tracking-wide mb-1.5">
              Vote du Parlement Européen
            </div>
            <p className="text-theme-secondary text-sm leading-relaxed">{match.voteSummaryClean}</p>
            {match.voteSummaryOriginal && match.voteSummaryOriginal !== match.voteSummaryClean && (
              <p className="text-theme-tertiary text-xs italic mt-1">{match.voteSummaryOriginal}</p>
            )}
            {match.voteDate && (
              <p className="text-theme-tertiary text-xs mt-1">
                Vote : {match.voteDate}
                {match.daysBetween != null && <span className="ml-2">({match.daysBetween} jours d'écart)</span>}
              </p>
            )}
          </div>

          <div className="border-t border-theme-light" />

          {/* Scores */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="text-xs text-theme-tertiary w-28 flex-shrink-0">Similarité :</div>
              <div className="flex-1 h-2 bg-theme-tertiary/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-dawta-500 rounded-full"
                  style={{ width: `${similarityPercent}%` }}
                />
              </div>
              <div className="text-xs text-theme-tertiary font-medium w-10 text-right flex-shrink-0">
                {similarityPercent}%
              </div>
            </div>

            {match.llmRelated != null && (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="text-xs text-theme-tertiary w-28">Avis LLM :</div>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                    match.llmRelated ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {match.llmRelated ? 'Lié' : 'Non lié'}
                  </span>
                </div>
                {match.llmExplanation && (
                  <p className="text-xs text-theme-tertiary italic pl-[7.5rem]">{match.llmExplanation}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ValidatedTable({ matches, filter, onFilterChange, onSelect }: {
  matches: SurveyVoteMatch[];
  filter: string;
  onFilterChange: (f: string) => void;
  onSelect: (m: SurveyVoteMatch) => void;
}) {
  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-theme-primary">Paires validées</h3>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-theme-tertiary" />
          <select
            value={filter}
            onChange={(e) => onFilterChange(e.target.value)}
            className="text-sm border border-theme-light rounded-lg px-2 py-1 bg-theme-secondary text-theme-primary"
          >
            <option value="">Toutes</option>
            <option value="accepted">Acceptées</option>
            <option value="refused">Refusées</option>
          </select>
        </div>
      </div>

      {matches.length === 0 ? (
        <p className="text-theme-tertiary text-sm text-center py-6">Aucune paire validée pour l'instant.</p>
      ) : (
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {matches.map((m) => (
            <button
              key={m.matchId}
              onClick={() => onSelect(m)}
              className={`w-full text-left p-3 rounded-lg border text-sm transition-opacity hover:opacity-80 ${
                m.adminValidated === true
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <SourceBadge source={m.source} />
                    <p className="font-medium text-theme-primary truncate">{m.questionClean}</p>
                  </div>
                  <p className="text-theme-tertiary truncate mt-0.5">{m.voteSummaryClean}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {m.similarityScore != null && (
                    <span className="text-xs text-theme-tertiary">
                      {Math.round(m.similarityScore * 100)}%
                    </span>
                  )}
                  {m.adminValidated === true ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function JudgeSurveyVote() {
  const { isAdmin, handleTitleClick } = useAdminMode();
  const [lastAction, setLastAction] = useState<'accepted' | 'refused' | null>(null);
  const [dashboardFilter, setDashboardFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [selectedMatch, setSelectedMatch] = useState<SurveyVoteMatch | null>(null);
  const queryClient = useQueryClient();

  // Stats — always fetched
  const { data: stats, refetch: refetchStats } = useQuery({
    queryKey: ['validationStats'],
    queryFn: fetchValidationStats,
  });

  // Random unvalidated match — only in admin mode, respects source filter
  const {
    data: match,
    isLoading: isLoadingMatch,
    error: matchError,
    refetch: refetchMatch,
  } = useQuery({
    queryKey: ['randomMatch', sourceFilter],
    queryFn: () => fetchRandomMatch(sourceFilter || undefined),
    enabled: isAdmin,
    retry: false,
  });

  // Validated matches for dashboard table
  const { data: validatedMatches = [] } = useQuery({
    queryKey: ['validatedMatches', dashboardFilter],
    queryFn: () => fetchValidatedMatches(dashboardFilter || undefined),
  });

  const validateMutation = useMutation({
    mutationFn: ({ matchId, validated }: { matchId: string; validated: boolean }) =>
      validateMatch(matchId, validated),
    onSuccess: (_result, variables) => {
      setLastAction(variables.validated ? 'accepted' : 'refused');
      refetchMatch();
      refetchStats();
      queryClient.invalidateQueries({ queryKey: ['validatedMatches'] });
      setTimeout(() => setLastAction(null), 1500);
    },
  });

  const handleJudge = useCallback(
    (accepted: boolean) => {
      if (!match) return;
      setLastAction(null);
      validateMutation.mutate({ matchId: match.matchId, validated: accepted });
    },
    [match, validateMutation],
  );

  return (
    <PageLayout maxWidth="2xl">
      {/* Header with easter egg */}
      <div className="relative">
        <div onClick={handleTitleClick} className="cursor-default select-none">
          <PageHeader
            title="Validation des paires sondage-vote"
            subtitle={
              isAdmin
                ? "Mode admin — Acceptez ou refusez les correspondances"
                : "Tableau de bord de la validation des correspondances sondage-vote"
            }
          />
        </div>
        {/* Discrete admin indicator */}
        <div className="absolute top-0 right-0 p-2">
          {isAdmin ? (
            <Unlock className="w-4 h-4 text-dawta-500" />
          ) : (
            <Lock className="w-4 h-4 text-theme-tertiary/30" />
          )}
        </div>
      </div>

      {/* Source filter — always visible */}
      {isAdmin && (
        <SourceFilter value={sourceFilter} onChange={setSourceFilter} />
      )}

      {/* Stats bar — always visible */}
      {stats && <StatsBar stats={stats} />}

      {/* Admin validation UI */}
      {isAdmin && (
        <>
          {isLoadingMatch && !match && (
            <LoadingState message="Chargement d'une paire..." />
          )}

          {matchError && (
            <div className="p-4 bg-dawta-50 rounded-xl border border-dawta-200 text-center">
              <Database className="w-8 h-8 text-dawta-400 mx-auto mb-2" />
              <p className="text-dawta-700 font-medium">Toutes les paires ont été validées !</p>
              <p className="text-dawta-600 text-sm mt-1">
                {sourceFilter
                  ? `Plus de paires ${sourceFilter} en attente.`
                  : "Il n'y a plus de paires en attente."}
              </p>
            </div>
          )}

          {/* Swipe card with feedback */}
          {match && !matchError && (
            <div className="relative">
              {lastAction && (
                <div
                  className={`absolute -top-2 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-full text-sm font-medium shadow-lg transition-all animate-pulse ${
                    lastAction === 'accepted'
                      ? 'bg-green-500 text-white'
                      : 'bg-red-500 text-white'
                  }`}
                >
                  {lastAction === 'accepted' ? (
                    <span className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" /> Acceptée
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <XCircle className="w-4 h-4" /> Refusée
                    </span>
                  )}
                </div>
              )}

              <SwipeCard
                match={match}
                onJudge={handleJudge}
                isSubmitting={validateMutation.isPending}
              />
            </div>
          )}
        </>
      )}

      {/* Public / shared: project info when not admin */}
      {!isAdmin && (
        <div className="p-4 bg-gradient-to-r from-dawta-50 to-dawta-100 rounded-xl border border-dawta-200">
          <div className="flex items-center justify-center gap-3">
            <Database className="w-5 h-5 text-dawta-600" />
            <div className="text-center">
              <span className="text-2xl font-bold text-dawta-700">
                {stats?.total.toLocaleString() ?? '…'}
              </span>
              <span className="text-dawta-600 ml-2">paires à valider</span>
            </div>
          </div>
          <p className="text-center text-sm text-dawta-600 mt-3">
            Ce projet étudie la corrélation entre les sondages européens et les votes du Parlement.
            Les paires sondage-vote sont validées manuellement pour constituer un jeu de données fiable.
          </p>
        </div>
      )}

      {/* Dashboard table — always visible */}
      <ValidatedTable
        matches={validatedMatches}
        filter={dashboardFilter}
        onFilterChange={setDashboardFilter}
        onSelect={setSelectedMatch}
      />

      {/* Detail modal */}
      {selectedMatch && (
        <MatchDetailModal match={selectedMatch} onClose={() => setSelectedMatch(null)} />
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
