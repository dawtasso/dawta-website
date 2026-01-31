import { Outlet, useLocation } from 'react-router-dom';
import { NavBar } from './molecules';

export default function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-white">
      <NavBar activePath={location.pathname} />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
