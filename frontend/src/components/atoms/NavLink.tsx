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
      className="relative px-4 py-2 text-sm font-body font-medium transition-colors group"
    >
      <span
        className={`relative z-10 transition-colors duration-200 ${
          isActive
            ? 'text-spectral'
            : 'text-luminous-secondary hover:text-luminous-primary'
        }`}
      >
        {label}
      </span>

      {/* Active indicator - spectral underline */}
      {isActive && (
        <motion.div
          layoutId="activeNavIndicator"
          className="absolute bottom-0 left-2 right-2 h-[0.5px]"
          style={{
            background: 'linear-gradient(90deg, var(--color-spectral-amber), var(--color-spectral-sky))',
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      )}

      {/* Hover glow effect */}
      <motion.div
        className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{
          background: 'radial-gradient(circle at center, rgba(142, 202, 230, 0.1) 0%, transparent 70%)',
        }}
      />
    </Link>
  );
}
