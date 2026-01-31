import type { ReactNode } from 'react';
import { Heading, Text } from '../atoms';

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
};

export default function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <header className="mb-8">
      <div className="flex items-start justify-between">
        <div>
          <Heading level={1}>{title}</Heading>
          {subtitle && (
            <Text variant="muted" className="mt-2">
              {subtitle}
            </Text>
          )}
        </div>
        {actions && <div className="flex space-x-2">{actions}</div>}
      </div>
    </header>
  );
}

