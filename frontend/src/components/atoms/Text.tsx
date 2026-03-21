import type { ReactNode } from 'react';

type TextProps = {
  children: ReactNode;
  variant?: 'body' | 'muted' | 'error';
  size?: 'sm' | 'base' | 'lg';
  className?: string;
};

const variantClasses: Record<NonNullable<TextProps['variant']>, string> = {
  body: 'text-[#F5F0EB]',
  muted: 'text-[#A8A29E]',
  error: 'text-vermillion',
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
