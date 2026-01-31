import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DiffractionLogo, NavLink } from '../atoms';

type NavItem = {
  to: string;
  label: string;
};

type NavBarProps = {
  activePath: string;
  items?: NavItem[];
};

const defaultNavItems: NavItem[] = [
  { to: '/', label: 'Home' },
  { to: '/report', label: 'Report' },
];

export default function NavBar({ activePath, items = defaultNavItems }: NavBarProps) {
  return (
    <nav className="relative">
      {/* Ultra-thin border with spectral gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-[0.5px] data-ray" />
      
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center py-5 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <DiffractionLogo size="md" />
            </motion.div>
            <span className="ml-3 text-lg font-display font-semibold text-luminous-primary tracking-wide">
              dawta
            </span>
          </Link>

          {/* Navigation links */}
          <div className="flex items-center space-x-1">
            {items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                label={item.label}
                isActive={activePath === item.to}
              />
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
