import { useEffect, useRef } from 'react';
import type { Pepite } from '../../../data/pepites';
import PepiteVisual from './PepiteVisual';
import PepiteExportButton from './PepiteExportButton';

type CardState = 'current' | 'exit-left' | 'exit-right' | 'enter-left' | 'enter-right' | 'hidden';

interface PepiteCardShellProps {
  pepite: Pepite;
  state: CardState;
  animate: boolean;
}

export default function PepiteCardShell({ pepite, state, animate }: PepiteCardShellProps) {
  const statRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = statRef.current;
    if (!el || !animate) return;
    el.classList.remove('animate-in');
    void el.getBoundingClientRect();
    el.classList.add('animate-in');
  }, [animate]);

  const className = `pep-card ${state === 'hidden' ? 'enter-right' : state}`;

  return (
    <div ref={cardRef} className={className} data-theme={pepite.theme}>
      {state === 'current' && (
        <PepiteExportButton pepite={pepite} cardRef={cardRef} />
      )}
      <div className="pep-card-top">
        <div className="pep-card-tag">{pepite.tag}</div>
        <h2 className="pep-card-headline">{pepite.headline}</h2>
      </div>
      <div className="pep-card-center">
        {pepite.bigStat && (
          <div ref={statRef} className="pep-big-stat">
            {pepite.bigStat}
          </div>
        )}
        {pepite.statLabel && <div className="pep-stat-label">{pepite.statLabel}</div>}
        <PepiteVisual visual={pepite.visual} theme={pepite.theme} animate={animate} />
      </div>
      <div className="pep-card-bottom">
        {pepite.body && (
          <p className="pep-card-body" dangerouslySetInnerHTML={{ __html: pepite.body }} />
        )}
        <a
          className="pep-card-source"
          href={pepite.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {pepite.sourceLabel}
        </a>
      </div>
    </div>
  );
}
