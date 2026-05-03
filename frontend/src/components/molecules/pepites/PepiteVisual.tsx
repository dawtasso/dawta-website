import { useEffect, useRef } from 'react';
import type {
  PepiteVisualData,
  SparklineData,
  NamesCompareData,
  TimelineData,
  TrunkData,
  SpeciesGridData,
  ClockData,
  BarCompareData,
  ImpactGridData,
  PepiteTheme,
} from '../../../data/pepites';
import { THEME_COLORS } from '../../../data/pepites';

interface PepiteVisualProps {
  visual: PepiteVisualData;
  theme: PepiteTheme;
  animate: boolean;
}

function useAnimateOnChange(animate: boolean) {
  const ref = useRef<HTMLDivElement>(null);
  const triggerRef = useRef(0);

  useEffect(() => {
    if (!animate) return;
    triggerRef.current++;
  }, [animate]);

  return { ref, key: animate ? triggerRef.current : 0 };
}

function Sparkline({ data, theme, animate }: { data: SparklineData; theme: PepiteTheme; animate: boolean }) {
  const lineRef = useRef<SVGPathElement>(null);
  const color = THEME_COLORS[theme].accent;
  const gradientId = `spark-fill-${data.type}`;

  useEffect(() => {
    const el = lineRef.current;
    if (!el || !animate) return;
    el.classList.remove('animate-draw');
    void el.getBoundingClientRect();
    el.classList.add('animate-draw');
  }, [animate]);

  return (
    <div className="pep-spark-container">
      <svg viewBox="0 0 280 60" preserveAspectRatio="none">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.25} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <path className="pep-spark-area" d={data.areaPath} fill={`url(#${gradientId})`} />
        <path
          ref={lineRef}
          className="pep-spark-line"
          d={data.linePath}
          stroke={color}
          strokeDasharray="600"
          strokeDashoffset="600"
        />
      </svg>
    </div>
  );
}

function NamesCompare({ data, animate }: { data: NamesCompareData; animate: boolean }) {
  const { key } = useAnimateOnChange(animate);

  return (
    <div className="pep-names-compare" key={key}>
      <div className="pep-names-col">
        <div className="pep-names-year">{data.left.year}</div>
        {data.left.names.map((n, i) => (
          <div
            key={n.name}
            className={`pep-name-item ${animate ? 'animate' : ''} ${n.highlight ? 'highlight' : ''}`}
            style={{ animationDelay: `${0.1 + i * 0.05}s` }}
          >
            {n.name}
          </div>
        ))}
      </div>
      <div className="pep-names-arrow">&rarr;</div>
      <div className="pep-names-col right">
        <div className="pep-names-year">{data.right.year}</div>
        {data.right.names.map((n, i) => (
          <div
            key={n.name}
            className={`pep-name-item ${animate ? 'animate' : ''} ${n.highlight ? 'highlight' : ''}`}
            style={{ animationDelay: `${0.5 + i * 0.05}s` }}
          >
            {n.name}
          </div>
        ))}
      </div>
    </div>
  );
}

function Timeline({ data, animate }: { data: TimelineData; animate: boolean }) {
  const { key } = useAnimateOnChange(animate);

  return (
    <div className="pep-timeline" key={key}>
      {data.items.map((item, i) => (
        <div
          key={item.year}
          className={`pep-timeline-item ${animate ? 'animate' : ''}`}
          style={{ animationDelay: `${0.2 + i * 0.2}s` }}
        >
          <span className="year">{item.year}</span> {item.label}
        </div>
      ))}
    </div>
  );
}

function Trunk({ data, animate }: { data: TrunkData; animate: boolean }) {
  const { key } = useAnimateOnChange(animate);
  const positions = [
    { top: '-8px', left: '50%', transform: 'translateX(-50%)' },
    { top: '18%', right: '-6px' },
    { bottom: '18%', right: '-6px' },
    { bottom: '-8px', left: '50%', transform: 'translateX(-50%)' },
    { bottom: '18%', left: '-6px' },
    { top: '18%', left: '-6px' },
  ];

  return (
    <div className="pep-trunk-visual" key={key}>
      <div className={`pep-trunk-circle ${animate ? 'animate' : ''}`}>
        <div className="inner-text">{data.innerText}</div>
        <div className="pep-people-ring">
          {Array.from({ length: data.people }).map((_, i) => (
            <span
              key={i}
              className={`pep-person-dot ${animate ? 'animate' : ''}`}
              style={{ ...positions[i % positions.length], animationDelay: `${0.3 + i * 0.15}s` } as React.CSSProperties}
            >
              🧍
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function SpeciesGrid({ data, theme, animate }: { data: SpeciesGridData; theme: PepiteTheme; animate: boolean }) {
  const { key } = useAnimateOnChange(animate);
  const color = THEME_COLORS[theme].accent;

  return (
    <div className="pep-species-grid" key={key}>
      {data.chips.map((chip, i) => (
        <span
          key={chip.label}
          className={`pep-species-chip ${animate ? 'animate' : ''}`}
          style={{
            borderColor: `${color}${Math.round(chip.opacity * 136).toString(16).padStart(2, '0')}`,
            color: `${color}${Math.round(chip.opacity * 255).toString(16).padStart(2, '0')}`,
            animationDelay: `${0.2 + i * 0.1}s`,
          }}
        >
          {chip.label}
        </span>
      ))}
    </div>
  );
}

function Clock({ data, animate }: { data: ClockData; animate: boolean }) {
  const { key } = useAnimateOnChange(animate);
  const marks = Array.from({ length: 12 }, (_, i) => i * 30);

  return (
    <div className="pep-clock-visual" key={key}>
      <div className="pep-clock-marks">
        {marks.map((deg) => (
          <div key={deg} className="pep-clock-mark" style={{ transform: `rotate(${deg}deg)` }} />
        ))}
      </div>
      <div
        className={`pep-clock-hand ${animate ? 'animate' : ''}`}
        style={{ transform: animate ? undefined : `rotate(${data.hourAngle}deg)` }}
      />
      <div className="pep-clock-dot" />
    </div>
  );
}

function BarCompare({ data, theme, animate }: { data: BarCompareData; theme: PepiteTheme; animate: boolean }) {
  const { key } = useAnimateOnChange(animate);
  const color = THEME_COLORS[theme].accent;

  return (
    <div className="pep-bar-compare" key={key}>
      {data.bars.map((bar, i) => (
        <div key={bar.label} className="pep-bar-row">
          <div className="pep-bar-label">
            <span>{bar.label}</span>
            <span>{bar.value}</span>
          </div>
          <div className="pep-bar-track">
            <div
              className={`pep-bar-fill ${animate ? 'animate' : ''}`}
              style={{
                width: `${bar.width}%`,
                background: bar.accent ? color : '#ffffff20',
                opacity: bar.opacity ?? 1,
                animationDelay: `${i * 0.15}s`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function ImpactGrid({ data, animate }: { data: ImpactGridData; animate: boolean }) {
  const { key } = useAnimateOnChange(animate);

  return (
    <div className="pep-impact-grid" key={key}>
      {data.cells.map((cell, i) => (
        <div
          key={cell.label}
          className={`pep-impact-cell ${animate ? 'animate' : ''}`}
          style={{ animationDelay: `${0.3 + i * 0.15}s` }}
        >
          <div className="num">{cell.num}</div>
          <div className="lbl">{cell.label}</div>
        </div>
      ))}
    </div>
  );
}

export default function PepiteVisual({ visual, theme, animate }: PepiteVisualProps) {
  switch (visual.type) {
    case 'sparkline-down':
    case 'sparkline-up':
      return <Sparkline data={visual} theme={theme} animate={animate} />;
    case 'names-compare':
      return <NamesCompare data={visual} animate={animate} />;
    case 'timeline':
      return <Timeline data={visual} animate={animate} />;
    case 'trunk':
      return <Trunk data={visual} animate={animate} />;
    case 'species-grid':
      return <SpeciesGrid data={visual} theme={theme} animate={animate} />;
    case 'clock':
      return <Clock data={visual} animate={animate} />;
    case 'bar-compare':
      return <BarCompare data={visual} theme={theme} animate={animate} />;
    case 'impact-grid':
      return <ImpactGrid data={visual} animate={animate} />;
  }
}
