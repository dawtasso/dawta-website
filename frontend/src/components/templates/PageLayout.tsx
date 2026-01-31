import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

type PageLayoutProps = {
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '5xl';
};

const maxWidthClasses: Record<NonNullable<PageLayoutProps['maxWidth']>, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
};

export default function PageLayout({ children, maxWidth = '4xl' }: PageLayoutProps) {
  return (
    <motion.div
      className={`${maxWidthClasses[maxWidth]} mx-auto px-6 py-12`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      {children}
    </motion.div>
  );
}
