import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Heading, Text } from '../atoms';

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
};

export default function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <motion.header
      className="mb-10"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="flex items-start justify-between gap-4 mb-2">
        <div>
          <Heading level={1} accent>
            {title}
          </Heading>
          {subtitle && (
            <Text variant="muted" size="lg" className="mt-3 max-w-xl">
              {subtitle}
            </Text>
          )}
        </div>
        {actions && (
          <div className="flex gap-3">
            {actions}
          </div>
        )}
      </div>
    </motion.header>
  );
}
