import type { ReactNode } from 'react';

type GlareTextProps = {
  children: ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'span' | 'p';
  className?: string;
  animated?: boolean;
};

export default function GlareText({
  children,
  as: Component = 'span',
  className = '',
  animated = true,
}: GlareTextProps) {
  return (
    <Component
      className={`relative inline-block ${className}`}
      style={{
        background: animated
          ? `linear-gradient(
              120deg,
              var(--color-text-primary) 0%,
              var(--color-text-primary) 40%,
              var(--color-spectral-sky) 50%,
              var(--color-text-primary) 60%,
              var(--color-text-primary) 100%
            )`
          : 'var(--color-text-primary)',
        backgroundSize: '200% 100%',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        animation: animated ? 'glare-sweep 4s ease-in-out infinite' : 'none',
      }}
    >
      {children}
    </Component>
  );
}

