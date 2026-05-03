import type { Pepite } from '../../../data/pepites';
import { THEME_COLORS } from '../../../data/pepites';

interface PepiteProgressProps {
  pepites: Pepite[];
  current: number;
}

export default function PepiteProgress({ pepites, current }: PepiteProgressProps) {
  return (
    <div className="pep-progress-track">
      {pepites.map((p, i) => {
        const isDone = i < current;
        const isActive = i === current;
        const classes = `pep-progress-seg ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`;

        return (
          <div key={p.id} className={classes}>
            <div
              className="fill"
              style={{ background: THEME_COLORS[p.theme].accent }}
            />
          </div>
        );
      })}
    </div>
  );
}
