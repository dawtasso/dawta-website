type StatusBadgeProps = {
  status: string;
  variant?: 'default' | 'success' | 'warning' | 'error';
};

const variantClasses: Record<NonNullable<StatusBadgeProps['variant']>, string> = {
  default: 'text-dawta-600 bg-dawta-100',
  success: 'text-dawta-700 bg-dawta-100',
  warning: 'text-dawta-800 bg-dawta-200',
  error: 'text-red-700 bg-red-100',
};

export default function StatusBadge({ status, variant = 'default' }: StatusBadgeProps) {
  return (
    <span
      className={`inline-block px-2 py-0.5 text-xs font-medium uppercase tracking-wide rounded ${variantClasses[variant]}`}
    >
      {status}
    </span>
  );
}

