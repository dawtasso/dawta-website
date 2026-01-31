import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

type NavLinkProps = {
  to: string;
  label: string;
  isActive: boolean;
};

export default function NavLink({ to, label, isActive }: NavLinkProps) {
  return (
    <Link
      to={to}
      className="relative px-4 py-2 text-sm font-body font-medium transition-colors"
    >
      <span
        className={`relative z-10 transition-colors duration-200 ${
          isActive
            ? 'text-earth-forest'
            : 'text-ink-muted hover:text-ink'
        }`}
      >
        {label}
      </span>

      {/* Active indicator - warm underline */}
      {isActive && (
        <motion.div
          layoutId="activeNav"
          className="absolute bottom-1 left-4 right-4 h-0.5 bg-earth-terracotta rounded-full"
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      )}
    </Link>
  );
}
