import { motion } from 'framer-motion';

type DataRayProps = {
  direction?: 'horizontal' | 'vertical';
  className?: string;
  animated?: boolean;
};

export default function DataRay({
  direction = 'horizontal',
  className = '',
  animated = true,
}: DataRayProps) {
  const isHorizontal = direction === 'horizontal';

  const baseStyles = isHorizontal
    ? { height: '1px', width: '100%' }
    : { width: '1px', height: '100%' };

  return (
    <div className={`relative ${className}`} style={baseStyles}>
      {/* Base line */}
      <div
        className="absolute inset-0"
        style={{
          background: isHorizontal
            ? 'linear-gradient(90deg, transparent 0%, var(--color-border-warm) 20%, var(--color-border-warm) 80%, transparent 100%)'
            : 'linear-gradient(180deg, transparent 0%, var(--color-border-warm) 20%, var(--color-border-warm) 80%, transparent 100%)',
        }}
      />

      {/* Subtle animated pulse */}
      {animated && (
        <motion.div
          className="absolute inset-0"
          style={{
            background: isHorizontal
              ? 'linear-gradient(90deg, transparent 0%, var(--color-earth-sage) 50%, transparent 100%)'
              : 'linear-gradient(180deg, transparent 0%, var(--color-earth-sage) 50%, transparent 100%)',
            backgroundSize: isHorizontal ? '200% 100%' : '100% 200%',
            opacity: 0.3,
          }}
          animate={{
            backgroundPosition: isHorizontal
              ? ['200% 0%', '-100% 0%']
              : ['0% 200%', '0% -100%'],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'linear',
            repeatDelay: 3,
          }}
        />
      )}
    </div>
  );
}
