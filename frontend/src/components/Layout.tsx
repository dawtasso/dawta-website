import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { NavBar } from './molecules';

export default function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-paper">
      {/* Subtle warm texture */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 80%, rgba(122, 154, 122, 0.08) 0%, transparent 50%),
                           radial-gradient(circle at 80% 20%, rgba(196, 120, 90, 0.06) 0%, transparent 50%)`,
        }}
      />

      <div className="relative z-10">
        <NavBar activePath={location.pathname} />
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
}
