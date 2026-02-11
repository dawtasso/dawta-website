import ReactMarkdown from 'react-markdown';

type MarkdownContentProps = {
  content: string;
  className?: string;
};

export default function MarkdownContent({ content, className = '' }: MarkdownContentProps) {
  return (
    <div className={`markdown-content ${className}`.trim()}>
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h2 className="text-2xl font-semibold text-theme-primary mb-4 mt-8 first:mt-0">
              {children}
            </h2>
          ),
          h2: ({ children }) => (
            <h3 className="text-xl font-semibold text-theme-primary mb-3 mt-6">
              {children}
            </h3>
          ),
          h3: ({ children }) => (
            <h4 className="text-lg font-semibold text-theme-primary mb-2 mt-4">
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p className="text-theme-secondary leading-relaxed mb-4">{children}</p>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-theme-primary">{children}</strong>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside text-theme-secondary mb-4 space-y-1">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside text-theme-secondary mb-4 space-y-1">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-accent-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-accent-primary pl-4 italic text-theme-secondary my-4">
              {children}
            </blockquote>
          ),
          code: ({ children }) => (
            <code className="bg-theme-secondary/10 px-1.5 py-0.5 rounded text-sm font-mono">
              {children}
            </code>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
