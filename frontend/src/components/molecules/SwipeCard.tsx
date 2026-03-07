import { useState, useRef } from 'react';
import type { SurveyVoteMatch } from '../../api/client';

type SwipeCardProps = {
  match: SurveyVoteMatch;
  onJudge: (accepted: boolean) => void;
  onPass?: () => void;
  isSubmitting?: boolean;
};

export default function SwipeCard({ match, onJudge, isSubmitting }: SwipeCardProps) {
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isSubmitting) return;
    startXRef.current = e.touches[0].clientX;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || isSubmitting) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startXRef.current;
    setSwipeOffset(diff);
  };

  const handleTouchEnd = () => {
    if (!isDragging || isSubmitting) return;
    setIsDragging(false);

    const threshold = 100;
    if (swipeOffset > threshold) {
      onJudge(true);
    } else if (swipeOffset < -threshold) {
      onJudge(false);
    }
    setSwipeOffset(0);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isSubmitting) return;
    startXRef.current = e.clientX;
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || isSubmitting) return;
    const diff = e.clientX - startXRef.current;
    setSwipeOffset(diff);
  };

  const handleMouseUp = () => {
    if (!isDragging || isSubmitting) return;
    setIsDragging(false);

    const threshold = 100;
    if (swipeOffset > threshold) {
      onJudge(true);
    } else if (swipeOffset < -threshold) {
      onJudge(false);
    }
    setSwipeOffset(0);
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      setSwipeOffset(0);
    }
  };

  const rotation = swipeOffset * 0.05;
  const opacity = Math.min(Math.abs(swipeOffset) / 100, 1);
  const isSwipingRight = swipeOffset > 30;
  const isSwipingLeft = swipeOffset < -30;

  const similarityPercent = Math.round((Number(match.similarityScore) || 0) * 100);

  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Swipe indicators */}
      <div
        className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 transition-opacity duration-200 ${
          isSwipingLeft ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="bg-red-500 text-white rounded-full p-4 shadow-lg">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>
      <div
        className={`absolute right-4 top-1/2 -translate-y-1/2 z-10 transition-opacity duration-200 ${
          isSwipingRight ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="bg-green-500 text-white rounded-full p-4 shadow-lg">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>

      {/* Card */}
      <div
        ref={cardRef}
        className={`bg-theme-secondary rounded-2xl shadow-lg overflow-hidden select-none ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        } ${isSubmitting ? 'opacity-50 pointer-events-none' : ''}`}
        style={{
          transform: `translateX(${swipeOffset}px) rotate(${rotation}deg)`,
          transition: isDragging ? 'none' : 'transform 0.3s ease-out',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {/* Overlay for swipe feedback */}
        <div
          className={`absolute inset-0 pointer-events-none transition-opacity duration-200 ${
            isSwipingRight ? 'bg-green-500/10' : isSwipingLeft ? 'bg-red-500/10' : ''
          }`}
          style={{ opacity }}
        />

        <div className="p-6 space-y-5">
          {/* Survey question */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="text-xs font-semibold text-dawta-600 uppercase tracking-wide">
                Question de sondage
              </div>
              {match.source && (
                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide ${
                  match.source === 'ESS'
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {match.source}
                </span>
              )}
            </div>
            <p className="text-theme-primary text-base leading-relaxed">
              {match.questionClean}
            </p>
            {match.surveyDate && (
              <div className="mt-1 text-xs text-theme-tertiary">
                Sondage : {match.surveyFile?.replace('.xlsx', '')} — {match.surveyDate}
              </div>
            )}
          </div>

          <div className="border-t border-theme-light" />

          {/* Vote */}
          <div>
            <div className="text-xs font-semibold text-bordeaux uppercase tracking-wide mb-2">
              Vote du Parlement Européen
            </div>
            <p className="text-theme-secondary text-sm leading-relaxed">
              {match.voteSummaryClean}
            </p>
            {match.voteDate && (
              <div className="mt-1 text-xs text-theme-tertiary">
                Vote : {match.voteDate}
                {match.daysBetween != null && (
                  <span className="ml-2">({match.daysBetween} jours d'écart)</span>
                )}
              </div>
            )}
          </div>

          {/* Scores section */}
          <div className="space-y-3 pt-2">
            {/* Similarity score */}
            <div className="flex items-center gap-2">
              <div className="text-xs text-theme-tertiary w-28 flex-shrink-0">Similarité :</div>
              <div className="flex-1 h-2 bg-theme-tertiary/30 rounded-full overflow-hidden min-w-[100px]">
                <div
                  className="h-full bg-dawta-500 rounded-full transition-all duration-300"
                  style={{ width: `${similarityPercent}%` }}
                />
              </div>
              <div className="text-xs text-theme-tertiary font-medium w-12 text-right flex-shrink-0">
                {similarityPercent}%
              </div>
            </div>

            {/* LLM related badge + explanation */}
            {match.llmRelated != null && (
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="text-xs text-theme-tertiary w-28">Avis LLM :</div>
                  <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                    match.llmRelated
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {match.llmRelated ? (
                      <>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Lié
                      </>
                    ) : (
                      <>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Non lié
                      </>
                    )}
                  </div>
                </div>
                {match.llmExplanation && (
                  <p className="text-xs text-theme-tertiary italic pl-[7.5rem]">
                    {match.llmExplanation}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Button controls */}
      <div className="flex justify-center gap-8 mt-6">
        <button
          onClick={() => !isSubmitting && onJudge(false)}
          disabled={isSubmitting}
          className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 hover:bg-red-200 text-red-600 transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Refuser"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <button
          onClick={() => !isSubmitting && onJudge(true)}
          disabled={isSubmitting}
          className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 hover:bg-green-200 text-green-600 transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Accepter"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </button>
      </div>

      {/* Instructions */}
      <p className="text-center text-theme-tertiary text-sm mt-4">
        Glissez ou cliquez pour accepter / refuser cette paire
      </p>
    </div>
  );
}
