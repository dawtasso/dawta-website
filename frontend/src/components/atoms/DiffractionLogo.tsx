import { motion } from 'framer-motion';

type DiffractionLogoProps = {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  animated?: boolean;
};

const sizeMap: Record<NonNullable<DiffractionLogoProps['size']>, number> = {
  sm: 32,
  md: 48,
  lg: 64,
  xl: 120,
};

// Earthy, warm colors - natural feeling
const earthColors = {
  forest: '#4A6741',
  sage: '#7A9A7A',
  clay: '#8B7355',
  terracotta: '#C4785A',
  stone: '#5C5C5C',
};

export default function DiffractionLogo({
  size = 'md',
  className = '',
  animated = true,
}: DiffractionLogoProps) {
  const dimension = sizeMap[size];

  // radii: [outer, inner] - creates the D-shaped bands
  const arcs = [
    { outerR: 50, innerR: 38, delay: 0 },
    { outerR: 34, innerR: 22, delay: 0.1 },
    { outerR: 18, innerR: 6, delay: 0.2 },
  ];

  const createDPath = (outerR: number, innerR: number) => {
    const cy = 50;
    const x = 2;
    
    return `
      M ${x} ${cy - outerR}
      A ${outerR} ${outerR} 0 0 1 ${x} ${cy + outerR}
      L ${x} ${cy + innerR}
      A ${innerR} ${innerR} 0 0 0 ${x} ${cy - innerR}
      Z
    `;
  };

  return (
    <div className={`relative inline-block ${className}`} style={{ width: dimension, height: dimension }}>
      <svg
        viewBox="0 0 55 100"
        width={dimension}
        height={dimension}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        <defs>
          {/* Gentle earth gradient - organic feeling */}
          <linearGradient id="earthGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={earthColors.forest}>
              {animated && (
                <animate
                  attributeName="stop-color"
                  values={`${earthColors.forest};${earthColors.sage};${earthColors.clay};${earthColors.forest}`}
                  dur="12s"
                  repeatCount="indefinite"
                />
              )}
            </stop>
            <stop offset="50%" stopColor={earthColors.sage}>
              {animated && (
                <animate
                  attributeName="stop-color"
                  values={`${earthColors.sage};${earthColors.clay};${earthColors.forest};${earthColors.sage}`}
                  dur="12s"
                  repeatCount="indefinite"
                />
              )}
            </stop>
            <stop offset="100%" stopColor={earthColors.terracotta}>
              {animated && (
                <animate
                  attributeName="stop-color"
                  values={`${earthColors.terracotta};${earthColors.forest};${earthColors.sage};${earthColors.terracotta}`}
                  dur="12s"
                  repeatCount="indefinite"
                />
              )}
            </stop>
          </linearGradient>
        </defs>

        <g>
          {arcs.map((arc, index) => (
            <motion.path
              key={index}
              d={createDPath(arc.outerR, arc.innerR)}
              fill="url(#earthGradient)"
              initial={animated ? { opacity: 0, x: -10 } : undefined}
              animate={animated ? { opacity: 1, x: 0 } : undefined}
              transition={{
                duration: 0.6,
                delay: arc.delay,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
