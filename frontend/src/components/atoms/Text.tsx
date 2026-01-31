import type { ReactNode } from 'react';

type TextProps = {
  children: ReactNode;
  variant?: 'body' | 'muted' | 'error' | 'accent';
  size?: 'sm' | 'base' | 'lg';
  className?: string;
};

const variantClasses: Record<NonNullable<TextProps['variant']>, string> = {
  body: 'text-ink-soft',
  muted: 'text-ink-muted',
  error: 'text-earth-terracotta',
  accent: 'text-earth-forest',
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
    <p className={`font-body leading-relaxed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim()}>
      {children}
    </p>
  );
}
