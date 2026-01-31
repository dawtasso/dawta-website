import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

type ButtonProps = {
  children: ReactNode;
  href?: string;
  to?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  target?: string;
  rel?: string;
  ariaLabel?: string;
};

export default function Button({
  children,
  href,
  to,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  target,
  rel,
  ariaLabel,
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center font-semibold text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md';
  
  const variantClasses = {
    primary: 'bg-bordeaux hover:bg-bordeaux-600',
    secondary: 'bg-bordeaux-700 hover:bg-bordeaux-800',
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
  };
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim();
  
  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        className={classes}
        aria-label={ariaLabel}
      >
        {children}
      </a>
    );
  }
  
  if (to) {
    return (
      <Link
        to={to}
        className={classes}
        aria-label={ariaLabel}
      >
        {children}
      </Link>
    );
  }
  
  return (
    <button
      onClick={onClick}
      className={classes}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}

