import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Heading, Text, DataRay } from '../atoms';

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
};

export default function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <motion.header
      className="mb-12"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <Heading level={1} glare={true}>
            {title}
          </Heading>
          {subtitle && (
            <Text variant="muted" size="lg" className="mt-3 max-w-xl">
              {subtitle}
            </Text>
          )}
        </div>
        {actions && (
          <div className="flex space-x-3">
            {actions}
          </div>
        )}
      </div>
      
      {/* Spectral data ray separator */}
      <DataRay direction="horizontal" className="mt-6" />
    </motion.header>
  );
}
