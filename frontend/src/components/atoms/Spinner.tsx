import { motion } from 'framer-motion';

type SpinnerProps = {
  size?: 'sm' | 'md' | 'lg';
};

const sizeMap: Record<NonNullable<SpinnerProps['size']>, number> = {
  sm: 16,
  md: 24,
  lg: 32,
};

export default function Spinner({ size = 'md' }: SpinnerProps) {
  const dimension = sizeMap[size];
  
  return (
    <div
      className="relative"
      style={{ width: dimension, height: dimension }}
      role="status"
      aria-label="Loading"
    >
      {/* Outer ring with spectral gradient */}
      <motion.svg
        viewBox="0 0 24 24"
        width={dimension}
        height={dimension}
        className="absolute inset-0"
      >
        <defs>
          <linearGradient id="spinnerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8ECAE6" />
            <stop offset="50%" stopColor="#83C5BE" />
            <stop offset="100%" stopColor="#E29578" />
          </linearGradient>
        </defs>
        <motion.circle
          cx="12"
          cy="12"
          r="10"
          fill="none"
          stroke="url(#spinnerGradient)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="50 14"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{ originX: '50%', originY: '50%' }}
        />
      </motion.svg>

      {/* Inner glow */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(142, 202, 230, 0.2) 0%, transparent 70%)',
        }}
        animate={{
          opacity: [0.5, 1, 0.5],
          scale: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
}
