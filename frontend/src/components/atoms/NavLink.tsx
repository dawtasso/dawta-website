import { Link } from 'react-router-dom';

type NavLinkProps = {
  to: string;
  label: string;
  isActive: boolean;
};

export default function NavLink({ to, label, isActive }: NavLinkProps) {
  return (
    <Link
      to={to}
      className={`py-4 text-sm font-medium border-b-2 transition-colors ${
        isActive
          ? 'border-dawta text-dawta-950'
          : 'border-transparent text-dawta-600 hover:text-dawta-950'
      }`}
    >
      {label}
    </Link>
  );
}
