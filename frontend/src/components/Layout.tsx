import { Outlet, useLocation } from 'react-router-dom';
import { NavBar, Footer } from './molecules';

export default function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <NavBar activePath={location.pathname} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
