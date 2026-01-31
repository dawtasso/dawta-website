import type { ReactNode } from 'react';

type HeadingLevel = 1 | 2 | 3 | 4;

type HeadingProps = {
  level?: HeadingLevel;
  children: ReactNode;
  className?: string;
};

const levelClasses: Record<HeadingLevel, string> = {
  1: 'text-4xl font-medium tracking-tight',
  2: 'text-2xl font-medium tracking-tight',
  3: 'text-xl font-medium',
  4: 'text-lg font-medium',
};

export default function Heading({ level = 1, children, className = '' }: HeadingProps) {
  const Tag = `h${level}` as const;
  return (
    <Tag className={`${levelClasses[level]} ${className}`.trim()}>
      {children}
    </Tag>
  );
}
