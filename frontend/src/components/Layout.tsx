import { Outlet, useLocation } from 'react-router-dom';
import { NavBar, Footer } from './molecules';

export default function Layout() {
  const location = useLocation();
  const watermarkLogo = '/logo_no_bg_grey.svg';

  return (
    <div className="min-h-screen flex flex-col bg-theme-primary relative paper-grain">
      {/* Watermark — flipped D flush against right edge */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.04] z-0">
        <div
          className="w-full h-full bg-contain bg-no-repeat"
          style={{
            backgroundImage: `url(${watermarkLogo})`,
            backgroundSize: '55%',
            backgroundPosition: 'right center',
            transform: 'scaleX(-1)',
            filter: 'brightness(0.5)',
          }}
        />
      </div>
      {/* Gold glow behind watermark */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse 50% 60% at 80% 50%, rgba(242, 201, 76, 0.04) 0%, transparent 70%)',
        }}
      />
      <NavBar activePath={location.pathname} />
      <main className="flex-1 diffraction-pattern relative z-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
