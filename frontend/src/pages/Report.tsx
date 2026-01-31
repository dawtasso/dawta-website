import { motion } from 'framer-motion';
import { 
  PageHeader, 
  PageLayout, 
  LineChart, 
  Gallery,
  GalleryStat,
  Text,
  DataRay,
} from '../components';

const sampleData = [
  {
    id: 'Engagement',
    data: [
      { x: 'Jan', y: 12 },
      { x: 'Feb', y: 19 },
      { x: 'Mar', y: 15 },
      { x: 'Apr', y: 22 },
      { x: 'May', y: 18 },
      { x: 'Jun', y: 25 },
    ],
  },
  {
    id: 'Impact',
    data: [
      { x: 'Jan', y: 8 },
      { x: 'Feb', y: 12 },
      { x: 'Mar', y: 18 },
      { x: 'Apr', y: 15 },
      { x: 'May', y: 24 },
      { x: 'Jun', y: 30 },
    ],
  },
];

const galleryItems = [
  {
    id: 1,
    size: 'wide' as const,
    content: <GalleryStat label="Community Reach" value="12.4K" trend="up" description="Past 30 days" />,
  },
  {
    id: 2,
    size: 'normal' as const,
    content: <GalleryStat label="Active Members" value="847" trend="up" />,
  },
  {
    id: 3,
    size: 'normal' as const,
    content: <GalleryStat label="Projects" value="23" trend="neutral" />,
  },
  {
    id: 4,
    size: 'normal' as const,
    content: <GalleryStat label="Partners" value="12" trend="up" />,
  },
  {
    id: 5,
    size: 'normal' as const,
    content: <GalleryStat label="Events" value="8" trend="neutral" />,
  },
];

export default function Report() {
  return (
    <PageLayout maxWidth="5xl">
      <PageHeader
        title="Report"
        subtitle="Insights and progress across our initiatives"
      />

      {/* Chart section */}
      <motion.section
        className="mb-12"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex items-baseline justify-between mb-4">
          <Text variant="muted" size="sm" className="uppercase tracking-wider text-xs">
            Engagement Overview
          </Text>
          <Text variant="muted" size="sm">
            Jan – Jun 2024
          </Text>
        </div>
        <LineChart 
          data={sampleData} 
          xLegend="Month" 
          yLegend="Score" 
          height={360}
        />
      </motion.section>

      {/* Separator */}
      <DataRay className="my-12" />

      {/* Metrics grid */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Text variant="muted" size="sm" className="uppercase tracking-wider text-xs mb-4">
          Key Metrics
        </Text>
        <Gallery items={galleryItems} />
      </motion.section>

      {/* Insights */}
      <motion.section
        className="mt-12 grid md:grid-cols-2 gap-4"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="card-editorial p-6">
          <Text variant="muted" size="sm" className="uppercase tracking-wider text-xs mb-3">
            Observation
          </Text>
          <p className="text-ink-soft leading-relaxed">
            Community engagement shows consistent growth, with a 
            <span className="text-earth-forest font-medium"> 67% increase </span>
            over the reporting period. Environmental initiatives lead adoption.
          </p>
        </div>

        <div className="card-editorial p-6">
          <Text variant="muted" size="sm" className="uppercase tracking-wider text-xs mb-3">
            Next Steps
          </Text>
          <p className="text-ink-soft leading-relaxed">
            Focus on 
            <span className="text-earth-forest font-medium"> local partnerships </span>
            to amplify reach. Economic literacy workshops show high potential.
          </p>
        </div>
      </motion.section>
    </PageLayout>
  );
}
