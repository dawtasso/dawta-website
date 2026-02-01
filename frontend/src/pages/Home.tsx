import { Link } from 'react-router-dom';
import { Logo } from '../components/atoms';

export default function Home() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <h1 className="text-5xl font-mergila font-semibold text-theme-primary mb-8 italic">Dawta</h1>
      <div className="mb-8">
        <Logo size="lg" className="h-24" />
      </div>
      <Link
        to="/projects"
        className="text-2xl font-medium text-theme-primary hover:text-dawta transition-colors underline decoration-2 underline-offset-4"
      >
        Projets
      </Link>
    </div>
  );
}
