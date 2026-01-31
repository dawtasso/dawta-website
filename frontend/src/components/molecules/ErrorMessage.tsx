import { motion } from 'framer-motion';
import { Heading, Text } from '../atoms';

type ErrorMessageProps = {
  title: string;
  message: string;
  hint?: string;
};

export default function ErrorMessage({ title, message, hint }: ErrorMessageProps) {
  return (
    <motion.div
      className="relative rounded-lg p-6 overflow-hidden"
      style={{
        background: 'rgba(226, 149, 120, 0.08)',
        border: '0.5px solid rgba(226, 149, 120, 0.2)',
        boxShadow: '0 0 30px rgba(226, 149, 120, 0.1)',
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Gradient accent line at top */}
      <div 
        className="absolute top-0 left-0 right-0 h-[0.5px]"
        style={{
          background: 'linear-gradient(90deg, transparent, var(--color-spectral-amber), var(--color-spectral-orange), transparent)',
        }}
      />

      <div className="flex items-start space-x-4">
        {/* Error icon */}
        <div 
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
          style={{
            background: 'rgba(226, 149, 120, 0.15)',
          }}
        >
          <svg 
            className="w-4 h-4" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
            style={{ color: 'var(--color-spectral-amber)' }}
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
            />
          </svg>
        </div>

        <div className="flex-1">
          <Heading level={3} glare={false} className="text-spectral-amber mb-2">
            {title}
          </Heading>
          <Text variant="muted" size="sm">
            {message}
          </Text>
          {hint && (
            <Text variant="muted" size="sm" className="mt-3 font-mono opacity-70">
              💡 {hint}
            </Text>
          )}
        </div>
      </div>
    </motion.div>
  );
}
