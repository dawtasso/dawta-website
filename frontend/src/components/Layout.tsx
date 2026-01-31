import { Outlet, useLocation } from 'react-router-dom';
import { NavBar, Footer } from './molecules';

export default function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-theme-primary">
      <NavBar activePath={location.pathname} />
      <main className="flex-1 diffraction-pattern">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
