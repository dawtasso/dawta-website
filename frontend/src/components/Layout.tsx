import { Link, Outlet, useLocation } from 'react-router-dom';

export default function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center py-4">
              <img 
                src="/logo.png" 
                alt="dawta" 
                className="h-8 w-auto"
              />
            </Link>
            <Link
              to="/"
              className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                location.pathname === '/'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Home
            </Link>
            <Link
              to="/report"
              className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                location.pathname === '/report'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Report
            </Link>
          </div>
        </div>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

