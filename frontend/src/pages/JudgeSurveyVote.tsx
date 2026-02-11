import { useState, useCallback } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { CheckCircle, XCircle, Database } from 'lucide-react';
import {
  fetchRandomMatch,
  submitJudgment,
  fetchJudgmentStats,
  type SurveyVoteMatch,
} from '../api/client';
import {
  PageHeader,
  ErrorMessage,
  LoadingState,
  PageLayout,
  SwipeCard,
} from '../components';

export default function JudgeSurveyVote() {
  const [judgedCount, setJudgedCount] = useState(0);
  const [lastResult, setLastResult] = useState<{ thumbsUp: boolean; stats: { thumbsUp: number; thumbsDown: number } } | null>(null);

  const {
    data: match,
    isLoading: isLoadingMatch,
    error: matchError,
    refetch: refetchMatch,
  } = useQuery({
    queryKey: ['randomMatch'],
    queryFn: fetchRandomMatch,
  });

  const { data: stats, refetch: refetchStats } = useQuery({
    queryKey: ['judgmentStats'],
    queryFn: fetchJudgmentStats,
  });

  const judgmentMutation = useMutation({
    mutationFn: ({
      match,
      thumbsUp,
    }: {
      match: SurveyVoteMatch;
      thumbsUp: boolean;
    }) => submitJudgment(match.matchId, thumbsUp),
    onSuccess: (result, variables) => {
      setJudgedCount((c) => c + 1);
      setLastResult({ thumbsUp: variables.thumbsUp, stats: result });
      // Fetch next match and refresh stats
      refetchMatch();
      refetchStats();
    },
  });

  const handleJudge = useCallback(
    (thumbsUp: boolean) => {
      if (!match) return;
      setLastResult(null);
      judgmentMutation.mutate({ match, thumbsUp });
    },
    [match, judgmentMutation]
  );

  if (isLoadingMatch && !match) {
    return (
      <PageLayout>
        <LoadingState message="Chargement d'une correspondance..." />
      </PageLayout>
    );
  }

  if (matchError) {
    return (
      <PageLayout>
        <ErrorMessage
          title="Erreur de chargement"
          message={matchError.message}
          hint="Vérifiez que le backend est lancé : make start-backend"
        />
      </PageLayout>
    );
  }

  return (
    <PageLayout maxWidth="2xl">
      <PageHeader
        title="Jugez les correspondances"
        subtitle="Aidez-nous à évaluer si les questions de sondage sont liées aux votes du Parlement"
      />

      {/* Judgment stats - compact row above card */}
      {stats && (
        <div className="mb-6 grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="p-2 bg-theme-secondary rounded-lg text-center">
            <div className="text-lg font-bold text-theme-primary">{stats.totalJudgments}</div>
            <div className="text-xs text-theme-tertiary">Jugements</div>
          </div>
          <div className="p-2 bg-green-50 rounded-lg text-center border border-green-100">
            <div className="text-lg font-bold text-green-600">{stats.thumbsUp}</div>
            <div className="text-xs text-green-600/70">Pertinents</div>
          </div>
          <div className="p-2 bg-red-50 rounded-lg text-center border border-red-100">
            <div className="text-lg font-bold text-red-600">{stats.thumbsDown}</div>
            <div className="text-xs text-red-600/70">Non pertinents</div>
          </div>
          <div className="p-2 bg-dawta-50 rounded-lg text-center border border-dawta-100">
            <div className="text-lg font-bold text-dawta-600">{judgedCount}</div>
            <div className="text-xs text-dawta-600/70">Vos jugements</div>
          </div>
        </div>
      )}

      {/* Card section */}
      <div className="relative">
        {/* Last result feedback - floating notification */}
        {lastResult && (
          <div
            className={`absolute -top-2 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-full text-sm font-medium shadow-lg transition-all animate-pulse ${
              lastResult.thumbsUp
                ? 'bg-green-500 text-white'
                : 'bg-red-500 text-white'
            }`}
          >
            {lastResult.thumbsUp ? (
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> Merci !
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <XCircle className="w-4 h-4" /> Merci !
              </span>
            )}
          </div>
        )}

        {/* Swipe card */}
        {match && (
          <SwipeCard
            match={match}
            onJudge={handleJudge}
            isSubmitting={judgmentMutation.isPending}
          />
        )}
      </div>

      {/* Paires info - below the card */}
      {stats && (
        <div className="mt-8 p-4 bg-gradient-to-r from-dawta-50 to-dawta-100 rounded-xl border border-dawta-200">
          <div className="flex items-center justify-center gap-3">
            <Database className="w-5 h-5 text-dawta-600" />
            <div className="text-center">
              <span className="text-2xl font-bold text-dawta-700">{stats.totalMatches.toLocaleString()}</span>
              <span className="text-dawta-600 ml-2">paires disponibles</span>
            </div>
          </div>
          {/* Progress bar */}
          <div className="mt-3 max-w-md mx-auto">
            <div className="flex justify-between text-xs text-dawta-600 mb-1">
              <span>{stats.matchesJudged} paires jugées</span>
              <span>{((stats.matchesJudged / stats.totalMatches) * 100).toFixed(1)}%</span>
            </div>
            <div className="h-2 bg-dawta-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-dawta-500 rounded-full transition-all duration-500"
                style={{ width: `${(stats.matchesJudged / stats.totalMatches) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Info section - compact */}
      <div className="mt-6 p-3 bg-theme-secondary/20 rounded-lg border border-theme-light/50">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-theme-secondary">
              <span className="text-green-600 font-medium">Pertinent</span> = même sujet
            </span>
          </div>
          <div className="flex items-center gap-2">
            <XCircle className="w-4 h-4 text-red-500" />
            <span className="text-theme-secondary">
              <span className="text-red-600 font-medium">Non pertinent</span> = pas lié
            </span>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

