import { useEffect, useState } from 'react';

type LogoProps = {
  alt?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  forceLight?: boolean; // Force white background logo
  forceDark?: boolean;  // Force grey background logo
};

const sizeClasses: Record<NonNullable<LogoProps['size']>, string> = {
  sm: 'h-6',
  md: 'h-8',
  lg: 'h-12',
};

export default function Logo({ 
  alt = 'dawta', 
  size = 'md', 
  className = '',
  forceLight = false,
  forceDark = false
}: LogoProps) {
  const [logoPath, setLogoPath] = useState('/logo_bg_grey.png');

  useEffect(() => {
    if (forceLight) {
      setLogoPath('/logo_bg_white.png');
      return;
    }
    if (forceDark) {
      setLogoPath('/logo_bg_grey.png');
      return;
    }
    
    // Check if we're in dark theme by checking CSS variable
    // If bg-primary is dark (not white), use grey logo, else use white logo
    const bgPrimary = getComputedStyle(document.documentElement)
      .getPropertyValue('--color-bg-primary')
      .trim();
    
    // Check if it's a dark color (not white/light)
    const isDarkTheme = bgPrimary !== '#ffffff' && bgPrimary !== 'rgb(255, 255, 255)' && !bgPrimary.startsWith('#f');
    setLogoPath(isDarkTheme ? '/logo_bg_grey.png' : '/logo_bg_white.png');
  }, [forceLight, forceDark]);

  return (
    <img
      src={logoPath}
      alt={alt}
      className={`${sizeClasses[size]} w-auto ${className}`.trim()}
    />
  );
}
