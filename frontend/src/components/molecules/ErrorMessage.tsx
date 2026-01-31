import { Heading, Text } from '../atoms';

type ErrorMessageProps = {
  title: string;
  message: string;
  hint?: string;
};

export default function ErrorMessage({ title, message, hint }: ErrorMessageProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <Heading level={3} className="text-red-800 mb-2">
        {title}
      </Heading>
      <Text variant="error" size="sm">
        {message}
      </Text>
      {hint && (
        <Text variant="muted" size="sm" className="mt-2">
          {hint}
        </Text>
      )}
    </div>
  );
}

