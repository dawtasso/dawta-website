interface PepiteNavProps {
  onPrev: () => void;
  onNext: () => void;
}

export default function PepiteNav({ onPrev, onNext }: PepiteNavProps) {
  return (
    <>
      {/* Touch tap zones (mobile) */}
      <div className="pep-nav-zones">
        <div className="pep-nav-zone" onClick={onPrev} />
        <div className="pep-nav-zone" onClick={onNext} />
      </div>

      {/* Arrow buttons (desktop) */}
      <div className="pep-nav-arrows">
        <button className="pep-nav-arrow" onClick={onPrev} aria-label="Précédent">
          <svg viewBox="0 0 24 24">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <button className="pep-nav-arrow" onClick={onNext} aria-label="Suivant">
          <svg viewBox="0 0 24 24">
            <polyline points="9 6 15 12 9 18" />
          </svg>
        </button>
      </div>
    </>
  );
}
