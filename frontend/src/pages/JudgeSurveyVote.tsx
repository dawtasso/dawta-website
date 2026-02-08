import { useState, useCallback } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
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
    }) => submitJudgment(match.questionId, match.voteId, thumbsUp),
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
          className={`mb-4 p-3 rounded-lg text-center text-sm font-medium transition-all ${
            lastResult.thumbsUp
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {lastResult.thumbsUp ? '👍 Merci !' : '👎 Merci !'} Cette correspondance a maintenant{' '}
          {lastResult.stats.thumbsUp} 👍 et {lastResult.stats.thumbsDown} 👎
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
      <div className="mt-12 prose prose-slate max-w-none">
        <h3 className="text-lg font-semibold text-theme-primary mb-3">
          Comment juger ?
        </h3>
        <ul className="text-theme-secondary text-sm space-y-2">
          <li>
            <span className="text-green-600 font-medium">👍 Pertinent</span> : La question de
            sondage et le vote du Parlement traitent du même sujet
          </li>
          <li>
            <span className="text-red-600 font-medium">👎 Non pertinent</span> : Les deux
            éléments ne sont pas liés ou la correspondance est forcée
          </li>
        </ul>
        <p className="text-theme-tertiary text-xs mt-4">
          Vos jugements nous aident à améliorer notre algorithme de correspondance entre
          l'opinion publique et les actions du Parlement Européen.
        </p>
      </div>
    </PageLayout>
  );
}

