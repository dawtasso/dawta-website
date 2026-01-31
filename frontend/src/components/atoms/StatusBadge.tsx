import { motion } from 'framer-motion';

type StatusBadgeProps = {
  status: string;
  variant?: 'default' | 'success' | 'warning' | 'error';
};

const variantStyles: Record<
  NonNullable<StatusBadgeProps['variant']>,
  { bg: string; text: string; glow: string }
> = {
  default: {
    bg: 'rgba(160, 160, 160, 0.1)',
    text: '#A0A0A0',
    glow: 'rgba(160, 160, 160, 0.2)',
  },
  success: {
    bg: 'rgba(131, 197, 190, 0.15)',
    text: '#83C5BE',
    glow: 'rgba(131, 197, 190, 0.3)',
  },
  warning: {
    bg: 'rgba(233, 196, 106, 0.15)',
    text: '#E9C46A',
    glow: 'rgba(233, 196, 106, 0.3)',
  },
  error: {
    bg: 'rgba(226, 149, 120, 0.15)',
    text: '#E29578',
    glow: 'rgba(226, 149, 120, 0.3)',
  },
};

export default function StatusBadge({ status, variant = 'default' }: StatusBadgeProps) {
  const styles = variantStyles[variant];

  return (
    <motion.span
      className="inline-flex items-center px-3 py-1 text-xs font-mono font-medium uppercase tracking-wider rounded-full border border-ray"
      style={{
        backgroundColor: styles.bg,
        color: styles.text,
        borderColor: `${styles.text}33`,
        boxShadow: `0 0 12px ${styles.glow}`,
      }}
      whileHover={{
        boxShadow: `0 0 20px ${styles.glow}`,
      }}
      transition={{ duration: 0.2 }}
    >
      {/* Pulsing dot indicator */}
      <motion.span
        className="w-1.5 h-1.5 rounded-full mr-2"
        style={{ backgroundColor: styles.text }}
        animate={{
          opacity: [1, 0.5, 1],
          scale: [1, 0.9, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      {status}
    </motion.span>
  );
}
