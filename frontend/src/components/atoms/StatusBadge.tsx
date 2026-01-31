type StatusBadgeProps = {
  status: string;
  variant?: 'default' | 'success' | 'warning' | 'error';
};

const variantClasses: Record<NonNullable<StatusBadgeProps['variant']>, string> = {
  default: 'text-gray-500 bg-gray-100',
  success: 'text-green-700 bg-green-100',
  warning: 'text-yellow-700 bg-yellow-100',
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

