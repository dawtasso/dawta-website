type PDFViewerProps = {
  url: string;
  title?: string;
  className?: string;
};

export default function PDFViewer({ url, title, className = '' }: PDFViewerProps) {
  return (
    <div className={`w-full ${className}`}>
      {title && (
        <h3 className="text-xl font-semibold text-theme-primary mb-4">{title}</h3>
      )}
      
      <div className="border border-theme-light rounded-lg overflow-hidden bg-theme-secondary">
        <div 
          className="w-full" 
          style={{ 
            height: '85vh', 
            minHeight: '600px', 
            maxHeight: '1200px' 
          }}
        >
          <iframe
            src={`${url}#zoom=page-fit&pagemode=none`}
            title={title || 'PDF Viewer'}
            className="w-full h-full border-0"
            style={{ minHeight: '600px' }}
          />
        </div>
      </div>

      <div className="mt-2 text-sm text-theme-tertiary text-center">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-dawta hover:text-dawta-700 underline"
        >
          Ouvrir dans un nouvel onglet
        </a>
      </div>
    </div>
  );
}

