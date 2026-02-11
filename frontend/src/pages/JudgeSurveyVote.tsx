import { useState, useCallback } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { CheckCircle, XCircle } from 'lucide-react';
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

      {/* Stats bar */}
      {stats && (
        <div className="mb-8 p-4 bg-theme-secondary rounded-xl">
          <div className="flex flex-wrap justify-center gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-theme-primary">{stats.totalJudgments}</div>
              <div className="text-xs text-theme-tertiary">Jugements totaux</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{stats.thumbsUp}</div>
              <div className="text-xs text-theme-tertiary">Pertinents</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">{stats.thumbsDown}</div>
              <div className="text-xs text-theme-tertiary">Non pertinents</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-dawta-600">{judgedCount}</div>
              <div className="text-xs text-theme-tertiary">Vos jugements</div>
            </div>
          </div>
        </div>
      )}

      {/* Last result feedback */}
      {lastResult && (
        <div
          className={`mb-4 p-4 rounded-lg text-center text-sm font-medium transition-all flex items-center justify-center gap-2 ${
            lastResult.thumbsUp
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {lastResult.thumbsUp ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <XCircle className="w-4 h-4" />
          )}
          <span>
            Merci ! Cette correspondance a maintenant{' '}
            <span className="inline-flex items-center gap-1">
              {lastResult.stats.thumbsUp} <CheckCircle className="w-3 h-3 text-green-600" />
            </span>{' '}
            et{' '}
            <span className="inline-flex items-center gap-1">
              {lastResult.stats.thumbsDown} <XCircle className="w-3 h-3 text-red-600" />
            </span>
          </span>
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

      {/* Info section */}
      <div className="mt-12 p-6 bg-theme-secondary/30 rounded-xl border border-theme-light">
        <h3 className="text-lg font-semibold text-theme-primary mb-4">
          Comment juger ?
        </h3>
        <ul className="text-theme-secondary text-sm space-y-3">
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <span>
              <span className="text-green-600 font-medium">Pertinent</span> : La question de
              sondage et le vote du Parlement traitent du même sujet
            </span>
          </li>
          <li className="flex items-start gap-3">
            <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <span>
              <span className="text-red-600 font-medium">Non pertinent</span> : Les deux
              éléments ne sont pas liés ou la correspondance est forcée
            </span>
          </li>
        </ul>
        <p className="text-theme-tertiary text-xs mt-4 pt-4 border-t border-theme-light">
          Vos jugements nous aident à améliorer notre algorithme de correspondance entre
          l'opinion publique et les actions du Parlement Européen.
        </p>
      </div>
    </PageLayout>
  );
}

