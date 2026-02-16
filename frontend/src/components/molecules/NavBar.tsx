import { Link } from 'react-router-dom';
import { Logo, NavLink } from '../atoms';
import { Button } from '../atoms';

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
    <nav className="border-b border-theme-light bg-theme-primary">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
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
        <Button
          href="https://buymeacoffee.com/dawta"
          target="_blank"
          rel="noopener noreferrer"
          variant="ghost"
          size="sm"
        >
          <svg className="w-4 h-4 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span className="hidden sm:inline">Offrir un café</span>
        </Button>
      </div>
    </nav>
  );
}
