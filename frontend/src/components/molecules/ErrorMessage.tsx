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
      className="bg-earth-terracotta/5 border border-earth-terracotta/20 rounded-organic p-5"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-earth-terracotta/10 flex items-center justify-center mt-0.5">
          <span className="text-earth-terracotta text-xs">!</span>
        </div>
        <div>
          <Heading level={4} className="text-earth-terracotta mb-1">
            {title}
          </Heading>
          <Text variant="muted" size="sm">
            {message}
          </Text>
          {hint && (
            <Text variant="muted" size="sm" className="mt-2 font-mono text-xs">
              {hint}
            </Text>
          )}
        </div>
      </div>
    </motion.div>
  );
}
