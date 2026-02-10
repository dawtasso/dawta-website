import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

type ButtonProps = {
  children: ReactNode;
  href?: string;
  to?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
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
  const baseClasses = 'inline-flex items-center font-medium rounded-lg transition-all duration-200';
  
  const variantClasses = {
    primary: 'bg-bordeaux hover:bg-bordeaux-600 text-white shadow-sm hover:shadow-md font-semibold',
    secondary: 'bg-bordeaux-700 hover:bg-bordeaux-800 text-white shadow-sm hover:shadow-md font-semibold',
    ghost: 'text-theme-primary hover:text-bordeaux hover:bg-theme-secondary/50',
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

