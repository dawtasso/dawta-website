import { Link } from 'react-router-dom';
import { Logo } from '../components/atoms';

export default function Home() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <h1 className="text-5xl font-mergila font-semibold text-theme-primary mb-8 italic">Dawta</h1>
      <div className="bg-white rounded-lg p-12 mb-8">
        <Logo size="lg" forceLight />
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
