type LogoProps = {
  alt?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const sizeClasses: Record<NonNullable<LogoProps['size']>, string> = {
  sm: 'h-6',
  md: 'h-8',
  lg: 'h-12',
};

export default function Logo({ 
  alt = 'dawta', 
  size = 'md', 
  className = ''
}: LogoProps) {
  // Always use grey logo for app logo
  const logoPath = '/logo_no_bg_grey.svg';

  return (
    <img
      src={logoPath}
      alt={alt}
      className={`${sizeClasses[size]} w-auto ${className}`.trim()}
    />
  );
}
