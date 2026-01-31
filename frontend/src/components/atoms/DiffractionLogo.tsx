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

// Spectral gradient colors - the prism effect
const spectralGradient = {
  start: '#E29578', // Amber
  mid1: '#F4A261',  // Soft orange
  mid2: '#E9C46A',  // Golden
  mid3: '#83C5BE',  // Teal
  end: '#8ECAE6',   // Sky blue
};

export default function DiffractionLogo({
  size = 'md',
  className = '',
  animated = true,
}: DiffractionLogoProps) {
  const dimension = sizeMap[size];
  
  // Animation variants for the shimmer effect
  const shimmerVariants = {
    animate: {
      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
    },
  };

  // Arc paths for the "D" logo - three concentric arcs
  const arcs = [
    { d: 'M 5 50 A 45 45 0 0 1 5 5 L 50 5 A 45 45 0 0 1 50 95 L 5 95 A 45 45 0 0 1 5 50', strokeWidth: 12 },
    { d: 'M 20 50 A 30 30 0 0 1 20 20 L 50 20 A 30 30 0 0 1 50 80 L 20 80 A 30 30 0 0 1 20 50', strokeWidth: 10 },
    { d: 'M 35 50 A 15 15 0 0 1 35 35 L 50 35 A 15 15 0 0 1 50 65 L 35 65 A 15 15 0 0 1 35 50', strokeWidth: 8 },
  ];

  return (
    <div className={`relative ${className}`} style={{ width: dimension, height: dimension }}>
      {/* Base SVG with gradient definitions */}
      <svg
        viewBox="0 0 100 100"
        width={dimension}
        height={dimension}
        className="overflow-visible"
      >
        <defs>
          {/* Animated spectral gradient */}
          <linearGradient id="spectralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={spectralGradient.start}>
              {animated && (
                <animate
                  attributeName="stop-color"
                  values={`${spectralGradient.start};${spectralGradient.mid2};${spectralGradient.end};${spectralGradient.mid2};${spectralGradient.start}`}
                  dur="8s"
                  repeatCount="indefinite"
                />
              )}
            </stop>
            <stop offset="25%" stopColor={spectralGradient.mid1}>
              {animated && (
                <animate
                  attributeName="stop-color"
                  values={`${spectralGradient.mid1};${spectralGradient.mid3};${spectralGradient.start};${spectralGradient.end};${spectralGradient.mid1}`}
                  dur="8s"
                  repeatCount="indefinite"
                />
              )}
            </stop>
            <stop offset="50%" stopColor={spectralGradient.mid2}>
              {animated && (
                <animate
                  attributeName="stop-color"
                  values={`${spectralGradient.mid2};${spectralGradient.end};${spectralGradient.mid1};${spectralGradient.start};${spectralGradient.mid2}`}
                  dur="8s"
                  repeatCount="indefinite"
                />
              )}
            </stop>
            <stop offset="75%" stopColor={spectralGradient.mid3}>
              {animated && (
                <animate
                  attributeName="stop-color"
                  values={`${spectralGradient.mid3};${spectralGradient.start};${spectralGradient.mid2};${spectralGradient.mid1};${spectralGradient.mid3}`}
                  dur="8s"
                  repeatCount="indefinite"
                />
              )}
            </stop>
            <stop offset="100%" stopColor={spectralGradient.end}>
              {animated && (
                <animate
                  attributeName="stop-color"
                  values={`${spectralGradient.end};${spectralGradient.mid1};${spectralGradient.mid3};${spectralGradient.mid2};${spectralGradient.end}`}
                  dur="8s"
                  repeatCount="indefinite"
                />
              )}
            </stop>
          </linearGradient>

          {/* Glow filter for luminous effect */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Render the three arcs with spectral gradient */}
        {arcs.map((arc, index) => (
          <motion.path
            key={index}
            d={arc.d}
            fill="none"
            stroke="url(#spectralGradient)"
            strokeWidth={arc.strokeWidth}
            strokeLinecap="round"
            filter="url(#glow)"
            initial={animated ? { pathLength: 0, opacity: 0 } : undefined}
            animate={animated ? { pathLength: 1, opacity: 1 } : undefined}
            transition={{
              pathLength: { duration: 1.5, delay: index * 0.2, ease: 'easeInOut' },
              opacity: { duration: 0.5, delay: index * 0.2 },
            }}
          />
        ))}
      </svg>

      {/* Shimmer overlay for extra prism effect */}
      {animated && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(
              120deg,
              transparent 30%,
              rgba(255, 255, 255, 0.1) 50%,
              transparent 70%
            )`,
            backgroundSize: '200% 200%',
          }}
          animate={shimmerVariants.animate}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      )}
    </div>
  );
}

