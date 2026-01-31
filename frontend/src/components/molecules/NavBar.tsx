import { Link } from 'react-router-dom';
import { Logo, NavLink } from '../atoms';

type NavItem = {
  to: string;
  label: string;
};

type NavBarProps = {
  activePath: string;
  items?: NavItem[];
};

const defaultNavItems: NavItem[] = [
  { to: '/', label: 'Accueil' },
  { to: '/projects', label: 'Projets' },
  { to: '/about', label: 'À propos' },
];

export default function NavBar({ activePath, items = defaultNavItems }: NavBarProps) {
  return (
    <nav className="border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center space-x-8">
          <Link to="/" className="flex items-center py-4">
            <Logo size="md" />
          </Link>
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
    </nav>
  );
}
