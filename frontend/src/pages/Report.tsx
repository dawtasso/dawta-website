import { motion } from 'framer-motion';
import { 
  PageHeader, 
  PageLayout, 
  LineChart, 
  DataRay,
  Gallery,
  GalleryStat,
  Text,
} from '../components';

const sampleData = [
  {
    id: 'Engagement',
    data: [
      { x: '2024-01', y: 12 },
      { x: '2024-02', y: 19 },
      { x: '2024-03', y: 15 },
      { x: '2024-04', y: 22 },
      { x: '2024-05', y: 18 },
      { x: '2024-06', y: 25 },
    ],
  },
  {
    id: 'Growth',
    data: [
      { x: '2024-01', y: 8 },
      { x: '2024-02', y: 12 },
      { x: '2024-03', y: 18 },
      { x: '2024-04', y: 15 },
      { x: '2024-05', y: 24 },
      { x: '2024-06', y: 30 },
    ],
  },
];

// Gallery items for the editorial grid showcase
const galleryItems = [
  {
    id: 1,
    size: 'wide' as const,
    content: <GalleryStat label="Total Views" value="12.4K" trend="up" description="Last 30 days" />,
  },
  {
    id: 2,
    size: 'normal' as const,
    content: <GalleryStat label="Conversion" value="3.2%" trend="up" />,
  },
  {
    id: 3,
    size: 'normal' as const,
    content: <GalleryStat label="Bounce Rate" value="42%" trend="down" />,
  },
  {
    id: 4,
    size: 'normal' as const,
    content: <GalleryStat label="Sessions" value="8.1K" trend="neutral" />,
  },
  {
    id: 5,
    size: 'normal' as const,
    content: <GalleryStat label="Avg. Duration" value="2:34" trend="up" />,
  },
];

export default function Report() {
  return (
    <PageLayout maxWidth="6xl">
      <PageHeader
        title="Report"
        subtitle="Visual data analysis and insights through the prism of light"
      />

      {/* Main chart section */}
      <motion.section
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-6">
          <Text variant="muted" size="sm" className="uppercase tracking-wider font-mono">
            Performance Overview
          </Text>
          <Text variant="muted" size="sm" className="font-mono">
            Jan - Jun 2024
          </Text>
        </div>
        <LineChart 
          data={sampleData} 
          xLegend="Month" 
          yLegend="Value" 
          height={400}
        />
      </motion.section>

      {/* Data ray to guide toward insights */}
      <div className="relative my-16">
        <DataRay direction="horizontal" />
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 bg-void-deep"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Text variant="muted" size="sm" className="uppercase tracking-widest font-mono">
            Key Metrics
          </Text>
        </motion.div>
      </div>

      {/* Editorial offset gallery */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Gallery items={galleryItems} />
      </motion.section>

      {/* Additional insights section */}
      <motion.section
        className="mt-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Insight card 1 */}
          <div className="card-glow rounded-lg p-8">
            <Text variant="muted" size="sm" className="uppercase tracking-wider font-mono mb-4">
              Analysis
            </Text>
            <p className="text-lg text-luminous-primary font-body leading-relaxed">
              Growth trajectory shows a consistent upward trend with a 
              <span className="text-spectral-sky font-semibold"> 67% increase </span>
              over the reporting period.
            </p>
          </div>

          {/* Insight card 2 */}
          <div className="card-glow rounded-lg p-8">
            <Text variant="muted" size="sm" className="uppercase tracking-wider font-mono mb-4">
              Recommendation
            </Text>
            <p className="text-lg text-luminous-primary font-body leading-relaxed">
              Focus on channels showing 
              <span className="text-spectral-teal font-semibold"> high engagement </span>
              to maximize conversion potential.
            </p>
          </div>
        </div>
      </motion.section>

      {/* Bottom signature ray */}
      <motion.div
        className="mt-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <DataRay direction="horizontal" thickness="thin" />
      </motion.div>
    </PageLayout>
  );
}
