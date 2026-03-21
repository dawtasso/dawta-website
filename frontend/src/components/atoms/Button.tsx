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
  const baseClasses = 'inline-flex items-center font-sans font-medium rounded transition-all duration-200';

  const variantClasses = {
    primary: 'bg-vermillion hover:bg-vermillion-500 text-white shadow-sm hover:shadow-md hover:shadow-vermillion/20 font-semibold',
    secondary: 'bg-surface hover:bg-ink-50 text-[#F5F0EB] border border-border hover:border-vermillion/40 shadow-sm font-semibold',
    ghost: 'text-[#A8A29E] hover:text-mint hover:bg-white/5',
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
