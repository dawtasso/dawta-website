import type { ReactNode } from 'react';

type PageLayoutProps = {
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl';
};

const maxWidthClasses: Record<NonNullable<PageLayoutProps['maxWidth']>, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '4xl': 'max-w-4xl',
  '6xl': 'max-w-6xl',
};

export default function PageLayout({ children, maxWidth = '4xl' }: PageLayoutProps) {
  return (
    <div className={`${maxWidthClasses[maxWidth]} mx-auto px-6 py-12`}>
      {children}
    </div>
  );
}

