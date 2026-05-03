import { useState, useEffect, useCallback, useRef } from 'react';
import { pepites } from '../../data/pepites';
import { PepiteCardShell, PepiteProgress, PepiteNav } from '../molecules/pepites';
import '../molecules/pepites/pepites.css';

type CardState = 'current' | 'exit-left' | 'exit-right' | 'enter-left' | 'enter-right' | 'hidden';

export default function PepiteCarousel() {
  const [current, setCurrent] = useState(0);
  const [cardStates, setCardStates] = useState<CardState[]>(() =>
    pepites.map((_, i) => (i === 0 ? 'current' : 'hidden'))
  );
  const [animateIndex, setAnimateIndex] = useState(0);
  const transitioning = useRef(false);
  const touchStart = useRef({ x: 0, y: 0 });
  const total = pepites.length;

  const goTo = useCallback(
    (index: number, direction: 'next' | 'prev') => {
      if (transitioning.current || index < 0 || index >= total || index === current) return;
      transitioning.current = true;

      setCardStates((prev) => {
        const next = [...prev];
        // Exit old card
        next[current] = direction === 'next' ? 'exit-left' : 'exit-right';
        // Prepare new card entry position
        next[index] = direction === 'next' ? 'enter-right' : 'enter-left';
        return next;
      });

      // Force a frame for the enter position to be applied, then animate to current
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setCardStates((prev) => {
            const next = [...prev];
            next[index] = 'current';
            return next;
          });
        });
      });

      setCurrent(index);
      setAnimateIndex(index);

      setTimeout(() => {
        setCardStates((prev) => {
          const next = [...prev];
          // Clean up old card
          const oldIndex = direction === 'next' ? index - 1 : index + 1;
          if (oldIndex >= 0 && oldIndex < total) {
            next[oldIndex] = 'hidden';
          }
          return next;
        });
        transitioning.current = false;
      }, 600);
    },
    [current, total]
  );

  const next = useCallback(() => goTo(current + 1, 'next'), [goTo, current]);
  const prev = useCallback(() => goTo(current - 1, 'prev'), [goTo, current]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        next();
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prev();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [next, prev]);

  // Touch swipe
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const handleTouchEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - touchStart.current.x;
      const dy = e.changedTouches[0].clientY - touchStart.current.y;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
        if (dx < 0) next();
        else prev();
      }
    };
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [next, prev]);

  // Trigger initial animation
  useEffect(() => {
    setAnimateIndex(0);
  }, []);

  return (
    <div className="pepites-root">
      {/* Header */}
      <div className="pep-header">
        <div className="pep-logo">
          P&eacute;pites <span>data.gouv</span>
        </div>
        <div className="pep-counter">
          {current + 1} / {total}
        </div>
      </div>

      {/* Progress */}
      <PepiteProgress pepites={pepites} current={current} />

      {/* Card stage */}
      <div className="pep-stage">
        {pepites.map((pepite, i) => (
          <PepiteCardShell
            key={pepite.id}
            pepite={pepite}
            state={cardStates[i]}
            animate={animateIndex === i && cardStates[i] === 'current'}
          />
        ))}
      </div>

      {/* Navigation */}
      <PepiteNav onPrev={prev} onNext={next} />
    </div>
  );
}
