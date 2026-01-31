import type { ReactNode } from 'react';

type HeadingLevel = 1 | 2 | 3 | 4;

type HeadingProps = {
  level?: HeadingLevel;
  children: ReactNode;
  className?: string;
  glare?: boolean;
};

const levelClasses: Record<HeadingLevel, string> = {
  1: 'text-5xl font-bold tracking-tight',
  2: 'text-3xl font-semibold tracking-tight',
  3: 'text-xl font-semibold',
  4: 'text-lg font-medium',
};

export default function Heading({ 
  level = 1, 
  children, 
  className = '',
  glare = true,
}: HeadingProps) {
  const Tag = `h${level}` as const;
  
  const baseClasses = `font-display ${levelClasses[level]} ${className}`.trim();
  
  // Only apply glare effect to h1 and h2 by default
  const shouldGlare = glare && level <= 2;
  
  return (
    <Tag className={`${baseClasses} ${shouldGlare ? 'text-glare' : 'text-luminous-primary'}`}>
      {children}
    </Tag>
  );
}
