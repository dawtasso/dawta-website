import { motion } from 'framer-motion';
import { Spinner, Text } from '../atoms';

type LoadingStateProps = {
  message?: string;
};

export default function LoadingState({ message = 'Loading...' }: LoadingStateProps) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Spinner size="md" />
      <Text variant="muted" size="sm" className="mt-3">
        {message}
      </Text>
    </motion.div>
  );
}
