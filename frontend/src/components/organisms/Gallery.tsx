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

const sizeClasses: Record<NonNullable<GalleryItem['size']>, string> = {
  normal: 'col-span-1 row-span-1',
  wide: 'col-span-2 row-span-1',
  tall: 'col-span-1 row-span-2',
  featured: 'col-span-2 row-span-2',
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4,
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
          className={`${sizeClasses[item.size || 'normal']}`}
          variants={itemVariants}
        >
          <div className="h-full card-editorial overflow-hidden">
            {item.content}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

// Stat card for gallery
type GalleryStatProps = {
  label: string;
  value: string | number;
  trend?: 'up' | 'down' | 'neutral';
  description?: string;
};

export function GalleryStat({ label, value, trend, description }: GalleryStatProps) {
  const trendColors = {
    up: 'text-earth-sage',
    down: 'text-earth-terracotta',
    neutral: 'text-ink-muted',
  };

  const trendIcons = {
    up: '↑',
    down: '↓',
    neutral: '→',
  };

  return (
    <div className="h-full p-5 flex flex-col justify-between min-h-[140px]">
      <span className="text-xs font-body font-medium text-ink-muted uppercase tracking-wider">
        {label}
      </span>
      
      <div>
        <span className="text-3xl font-display font-semibold text-ink">
          {value}
        </span>
        {trend && (
          <span className={`ml-2 text-sm font-body ${trendColors[trend]}`}>
            {trendIcons[trend]}
          </span>
        )}
      </div>
      
      {description && (
        <p className="text-xs text-ink-muted mt-1">
          {description}
        </p>
      )}
    </div>
  );
}

// Image card for gallery
type GalleryImageProps = {
  src: string;
  alt: string;
  caption?: string;
};

export function GalleryImage({ src, alt, caption }: GalleryImageProps) {
  return (
    <div className="relative h-full min-h-[180px]">
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
      />
      
      {caption && (
        <>
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to top, rgba(0, 0, 0, 0.5) 0%, transparent 40%)',
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <p className="text-sm font-body text-white/90">
              {caption}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
