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
      <motion.svg
        viewBox="0 0 24 24"
        width={dimension}
        height={dimension}
      >
        <motion.circle
          cx="12"
          cy="12"
          r="10"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="text-earth-sage"
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
    </div>
  );
}
