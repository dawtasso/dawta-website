import type { ReactNode } from 'react';

type HeadingLevel = 1 | 2 | 3 | 4;

type HeadingProps = {
  level?: HeadingLevel;
  children: ReactNode;
  className?: string;
  accent?: boolean;
};

const levelClasses: Record<HeadingLevel, string> = {
  1: 'text-4xl font-semibold tracking-tight',
  2: 'text-2xl font-semibold tracking-tight',
  3: 'text-xl font-medium',
  4: 'text-lg font-medium',
};

export default function Heading({ 
  level = 1, 
  children, 
  className = '',
  accent = false,
}: HeadingProps) {
  const Tag = `h${level}` as const;
  
  return (
    <Tag className={`font-display text-ink ${levelClasses[level]} ${accent ? 'underline-warm' : ''} ${className}`.trim()}>
      {children}
    </Tag>
  );
}
