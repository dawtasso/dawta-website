import type { ReactNode } from 'react';

type TextProps = {
  children: ReactNode;
  variant?: 'body' | 'muted' | 'error' | 'spectral';
  size?: 'sm' | 'base' | 'lg';
  className?: string;
};

const variantClasses: Record<NonNullable<TextProps['variant']>, string> = {
  body: 'text-luminous-primary',
  muted: 'text-luminous-secondary',
  error: 'text-spectral-amber',
  spectral: 'text-spectral',
};

const sizeClasses: Record<NonNullable<TextProps['size']>, string> = {
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
};

export default function Text({
  children,
  variant = 'body',
  size = 'base',
  className = '',
}: TextProps) {
  return (
    <p className={`font-body ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim()}>
      {children}
    </p>
  );
}
