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
      className={`py-3 text-sm font-sans font-medium uppercase tracking-widest transition-colors duration-200 ${
        isActive
          ? 'text-vermillion'
          : 'text-[#A8A29E] hover:text-[#F5F0EB]'
      }`}
    >
      {label}
    </Link>
  );
}
