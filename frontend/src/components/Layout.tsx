import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { NavBar } from './molecules';

export default function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Ambient background gradients */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Deep void base */}
        <div className="absolute inset-0 bg-void-deep" />
        
        {/* Subtle spectral ambient glow in corners */}
        <div 
          className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(142, 202, 230, 0.08) 0%, transparent 60%)',
          }}
        />
        <div 
          className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(226, 149, 120, 0.06) 0%, transparent 60%)',
          }}
        />
        
        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <NavBar activePath={location.pathname} />
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
}
