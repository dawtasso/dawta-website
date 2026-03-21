import type { ReactNode } from 'react';

type HeadingLevel = 1 | 2 | 3 | 4;

type HeadingProps = {
  level?: HeadingLevel;
  children: ReactNode;
  className?: string;
};

const levelClasses: Record<HeadingLevel, string> = {
  1: 'text-5xl font-serif tracking-tight text-[#F5F0EB]',
  2: 'text-3xl font-serif tracking-tight text-[#F5F0EB]',
  3: 'text-xl font-sans font-semibold text-[#F5F0EB]',
  4: 'text-base font-sans font-semibold uppercase tracking-widest text-[#A8A29E]',
};

export default function Heading({ level = 1, children, className = '' }: HeadingProps) {
  const Tag = `h${level}` as const;
  return (
    <Tag className={`${levelClasses[level]} ${className}`.trim()}>
      {children}
    </Tag>
  );
}
