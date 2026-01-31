import { motion } from 'framer-motion';
import { Spinner, Text } from '../atoms';

type LoadingStateProps = {
  message?: string;
};

export default function LoadingState({ message = 'Loading...' }: LoadingStateProps) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Spinner size="lg" />
      <Text variant="muted" className="mt-4">
        {message}
      </Text>
      
      {/* Subtle pulsing line below */}
      <motion.div
        className="mt-6 w-24 h-[0.5px]"
        style={{
          background: 'linear-gradient(90deg, transparent, var(--color-spectral-sky), transparent)',
        }}
        animate={{
          opacity: [0.3, 0.7, 0.3],
          scaleX: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </motion.div>
  );
}
