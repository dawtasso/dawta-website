import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

type GalleryItem = {
  id: string | number;
  content: ReactNode;
  size?: 'normal' | 'wide' | 'tall' | 'featured';
};

type GalleryProps = {
  items: GalleryItem[];
  className?: string;
};

// Editorial offset grid layout patterns
const sizeClasses: Record<NonNullable<GalleryItem['size']>, string> = {
  normal: 'col-span-1 row-span-1',
  wide: 'col-span-2 row-span-1',
  tall: 'col-span-1 row-span-2',
  featured: 'col-span-2 row-span-2',
};

// Staggered animation for reveal
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.95,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

export default function Gallery({ items, className = '' }: GalleryProps) {
  return (
    <motion.div
      className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {items.map((item) => (
        <motion.div
          key={item.id}
          className={`
            ${sizeClasses[item.size || 'normal']}
            relative group
          `}
          variants={itemVariants}
        >
          {/* Card with diffraction hover effect */}
          <div className="h-full card-glow rounded-lg overflow-hidden diffract-hover">
            {/* Content */}
            <div className="relative h-full">
              {item.content}
            </div>

            {/* Hover border glow */}
            <motion.div
              className="absolute inset-0 rounded-lg pointer-events-none"
              style={{
                border: '0.5px solid transparent',
                background: 'linear-gradient(135deg, rgba(142, 202, 230, 0.3), rgba(226, 149, 120, 0.3)) border-box',
                WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
              }}
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

// Companion component for gallery image items
type GalleryImageProps = {
  src: string;
  alt: string;
  caption?: string;
};

export function GalleryImage({ src, alt, caption }: GalleryImageProps) {
  return (
    <div className="relative h-full min-h-[200px]">
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
      />
      
      {/* Gradient overlay */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to top, rgba(13, 13, 13, 0.8) 0%, transparent 50%)',
        }}
      />
      
      {/* Caption */}
      {caption && (
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="text-sm font-body text-luminous-secondary">
            {caption}
          </p>
        </div>
      )}

      {/* Spectral border accent on hover */}
      <motion.div
        className="absolute bottom-0 left-4 right-4 h-[0.5px]"
        style={{
          background: 'linear-gradient(90deg, var(--color-spectral-amber), var(--color-spectral-sky))',
        }}
        initial={{ scaleX: 0, opacity: 0 }}
        whileHover={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
    </div>
  );
}

// Companion component for gallery stat cards
type GalleryStatProps = {
  label: string;
  value: string | number;
  trend?: 'up' | 'down' | 'neutral';
  description?: string;
};

export function GalleryStat({ label, value, trend, description }: GalleryStatProps) {
  const trendColors = {
    up: 'text-spectral-teal',
    down: 'text-spectral-amber',
    neutral: 'text-luminous-muted',
  };

  return (
    <div className="h-full p-6 flex flex-col justify-between min-h-[160px]">
      <span className="text-xs font-display font-medium text-luminous-muted uppercase tracking-wider">
        {label}
      </span>
      
      <div>
        <span className="text-4xl font-display font-bold text-glare">
          {value}
        </span>
        {trend && (
          <span className={`ml-2 text-sm ${trendColors[trend]}`}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
          </span>
        )}
      </div>
      
      {description && (
        <p className="text-sm text-luminous-muted mt-2">
          {description}
        </p>
      )}
    </div>
  );
}

