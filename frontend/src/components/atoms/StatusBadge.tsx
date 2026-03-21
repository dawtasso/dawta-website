type StatusBadgeProps = {
  status: string;
  variant?: 'default' | 'success' | 'warning' | 'error';
};

const variantClasses: Record<NonNullable<StatusBadgeProps['variant']>, string> = {
  default: 'text-[#A8A29E] bg-surface',
  success: 'text-mint bg-mint/10',
  warning: 'text-gold bg-gold/10',
  error: 'text-vermillion bg-vermillion/10',
};

export default function StatusBadge({ status, variant = 'default' }: StatusBadgeProps) {
  return (
    <span
      className={`inline-block px-2 py-0.5 text-xs font-sans font-medium uppercase tracking-wide rounded ${variantClasses[variant]}`}
    >
      {status}
    </span>
  );
}
