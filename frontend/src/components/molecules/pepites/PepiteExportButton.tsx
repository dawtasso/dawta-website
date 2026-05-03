import { useState, useRef } from 'react';
import { toPng } from 'html-to-image';
import type { Pepite } from '../../../data/pepites';

interface PepiteExportButtonProps {
  pepite: Pepite;
  cardRef: React.RefObject<HTMLDivElement | null>;
}

type ExportFormat = 'story' | 'square';

const FORMATS: Record<ExportFormat, { label: string; width: number; height: number }> = {
  story: { label: '9:16 Story', width: 1080, height: 1920 },
  square: { label: '1:1 Carré', width: 1080, height: 1080 },
};

export default function PepiteExportButton({ pepite, cardRef }: PepiteExportButtonProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [exporting, setExporting] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  const handleExport = async (format: ExportFormat) => {
    if (!cardRef.current || exporting) return;
    setExporting(true);
    setShowPicker(false);

    const { width, height } = FORMATS[format];
    // Create off-screen container at exact pixel dimensions
    const container = document.createElement('div');
    container.style.cssText = `
      position: fixed; left: -9999px; top: 0;
      width: ${width}px; height: ${height}px;
      background: linear-gradient(165deg, #0e0e16 0%, #06060b 100%);
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      padding: 80px 60px;
      font-family: 'DM Sans', sans-serif;
      color: #f0eee6;
    `;

    // Card content clone
    const cardClone = cardRef.current.cloneNode(true) as HTMLElement;
    cardClone.style.cssText = `
      position: relative; width: 100%; max-width: ${Math.min(width - 120, 900)}px;
      flex: 1; display: flex; flex-direction: column; justify-content: space-between;
      opacity: 1; pointer-events: none; transform: none;
      padding: 0; border: none; background: none; border-radius: 0;
    `;
    // Remove export button from clone
    cardClone.querySelectorAll('.pep-export-btn').forEach((el) => el.remove());

    container.appendChild(cardClone);

    // Branding footer
    const footer = document.createElement('div');
    footer.style.cssText = `
      width: 100%; display: flex; justify-content: space-between; align-items: center;
      padding-top: 40px; border-top: 1px solid #ffffff15;
      font-family: 'JetBrains Mono', monospace; font-size: 24px; color: #4a4850;
    `;
    footer.innerHTML = `
      <span style="font-family:'Instrument Serif',serif;font-size:32px;color:#f0eee6">
        dawta<span style="color:#7a7880;font-style:italic">.fr</span>
      </span>
      <span style="font-size:20px">Source: data.gouv.fr</span>
    `;
    container.appendChild(footer);

    document.body.appendChild(container);

    try {
      // Wait for fonts to render
      await new Promise((r) => setTimeout(r, 200));

      const dataUrl = await toPng(container, {
        width,
        height,
        pixelRatio: 1,
        style: { transform: 'none', opacity: '1' },
      });

      // Trigger download
      const link = document.createElement('a');
      link.download = `pepite-${pepite.id}-${format}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      document.body.removeChild(container);
      setExporting(false);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        className="pep-export-btn"
        onClick={(e) => {
          e.stopPropagation();
          setShowPicker(!showPicker);
        }}
        aria-label="Exporter"
        disabled={exporting}
      >
        {exporting ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" strokeDasharray="30" strokeDashoffset="10">
              <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite" />
            </circle>
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        )}
      </button>

      {showPicker && (
        <div
          ref={pickerRef}
          style={{
            position: 'absolute',
            top: '40px',
            right: '0',
            background: '#14141f',
            border: '1px solid #ffffff15',
            borderRadius: '8px',
            padding: '4px',
            zIndex: 200,
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
            minWidth: '120px',
          }}
        >
          {(Object.entries(FORMATS) as [ExportFormat, typeof FORMATS[ExportFormat]][]).map(
            ([key, { label }]) => (
              <button
                key={key}
                onClick={(e) => {
                  e.stopPropagation();
                  handleExport(key);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#f0eee6',
                  padding: '8px 12px',
                  fontSize: '12px',
                  fontFamily: "'JetBrains Mono', monospace",
                  cursor: 'pointer',
                  textAlign: 'left',
                  borderRadius: '6px',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#ffffff10')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
              >
                {label}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}
