import { Spinner, Text } from '../atoms';

type LoadingStateProps = {
  message?: string;
};

export default function LoadingState({ message = 'Chargement...' }: LoadingStateProps) {
  return (
    <div className="flex items-center space-x-3">
      <Spinner size="sm" />
      <Text variant="muted">{message}</Text>
    </div>
  );
}

