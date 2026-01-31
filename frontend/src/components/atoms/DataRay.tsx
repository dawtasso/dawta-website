import { motion } from 'framer-motion';

type DataRayProps = {
  direction?: 'horizontal' | 'vertical';
  className?: string;
  thickness?: 'thin' | 'normal';
  animated?: boolean;
};

export default function DataRay({
  direction = 'horizontal',
  className = '',
  thickness = 'thin',
  animated = true,
}: DataRayProps) {
  const isHorizontal = direction === 'horizontal';
  const size = thickness === 'thin' ? '0.5px' : '1px';

  const baseStyles = isHorizontal
    ? { height: size, width: '100%' }
    : { width: size, height: '100%' };

  const gradientDirection = isHorizontal ? '90deg' : '180deg';

  return (
    <div className={`relative ${className}`} style={baseStyles}>
      {/* Base ray - subtle static gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(${gradientDirection}, 
            transparent 0%, 
            var(--color-spectral-amber) 15%,
            var(--color-spectral-gold) 35%,
            var(--color-spectral-teal) 65%,
            var(--color-spectral-sky) 85%,
            transparent 100%
          )`,
          opacity: 0.6,
        }}
      />

      {/* Animated pulse overlay */}
      {animated && (
        <motion.div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(${gradientDirection}, 
              transparent 0%,
              rgba(255, 255, 255, 0.8) 50%,
              transparent 100%
            )`,
            backgroundSize: isHorizontal ? '200% 100%' : '100% 200%',
          }}
          animate={{
            backgroundPosition: isHorizontal
              ? ['200% 0%', '-100% 0%']
              : ['0% 200%', '0% -100%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
            repeatDelay: 2,
          }}
        />
      )}

      {/* Edge glow */}
      <div
        className="absolute inset-0"
        style={{
          boxShadow: `0 0 8px 1px rgba(142, 202, 230, 0.3)`,
        }}
      />
    </div>
  );
}

