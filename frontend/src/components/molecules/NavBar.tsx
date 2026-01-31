import { Link } from 'react-router-dom';
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
    <nav className="border-b border-black/5">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center py-5 group">
            <DiffractionLogo size="sm" />
            <span className="ml-3 text-lg font-display font-semibold text-ink tracking-tight">
              dawta
            </span>
          </Link>

          {/* Navigation links */}
          <div className="flex items-center gap-1">
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
