import { Outlet, useLocation } from 'react-router-dom';
import { NavBar, Footer } from './molecules';

export default function Layout() {
  const location = useLocation();
  // Use grey logo for watermark
  const watermarkLogo = '/logo_no_bg_grey.svg';

  return (
    <div className="min-h-screen flex flex-col bg-theme-primary relative">
      <div className="fixed inset-0 pointer-events-none opacity-[0.025] z-0">
        <div 
          className="w-full h-full bg-contain bg-no-repeat"
          style={{
            backgroundImage: `url(${watermarkLogo})`,
            backgroundSize: '60%',
            backgroundPosition: 'calc(100% - 110%) center',
            transform: 'scaleX(-1)',
          }}
        />
      </div>
      <NavBar activePath={location.pathname} />
      <main className="flex-1 diffraction-pattern relative z-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
