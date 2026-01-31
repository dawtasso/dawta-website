import type { ReactNode } from 'react';

type TextProps = {
  children: ReactNode;
  variant?: 'body' | 'muted' | 'error';
  size?: 'sm' | 'base' | 'lg';
  className?: string;
};

const variantClasses: Record<NonNullable<TextProps['variant']>, string> = {
  body: 'text-gray-900',
  muted: 'text-gray-600',
  error: 'text-red-600',
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
    <p className={`${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim()}>
      {children}
    </p>
  );
}

