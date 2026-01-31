type StatusBadgeProps = {
  status: string;
  variant?: 'default' | 'success' | 'warning' | 'error';
};

const variantStyles: Record<
  NonNullable<StatusBadgeProps['variant']>,
  { bg: string; text: string; dot: string }
> = {
  default: {
    bg: 'bg-ink-faint/10',
    text: 'text-ink-muted',
    dot: 'bg-ink-muted',
  },
  success: {
    bg: 'bg-earth-sage/10',
    text: 'text-earth-forest',
    dot: 'bg-earth-sage',
  },
  warning: {
    bg: 'bg-earth-clay/10',
    text: 'text-earth-clay',
    dot: 'bg-earth-clay',
  },
  error: {
    bg: 'bg-earth-terracotta/10',
    text: 'text-earth-terracotta',
    dot: 'bg-earth-terracotta',
  },
};

export default function StatusBadge({ status, variant = 'default' }: StatusBadgeProps) {
  const styles = variantStyles[variant];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 text-xs font-body font-medium rounded-full ${styles.bg} ${styles.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${styles.dot}`} />
      {status}
    </span>
  );
}
