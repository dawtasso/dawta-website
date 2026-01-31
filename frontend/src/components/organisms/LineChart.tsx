import { ResponsiveLine } from '@nivo/line';
import { motion } from 'framer-motion';
import { useState } from 'react';

type DataPoint = {
  x: string | number;
  y: number;
};

type ChartSeries = {
  id: string;
  data: DataPoint[];
};

type LineChartProps = {
  data: ChartSeries[];
  xLegend?: string;
  yLegend?: string;
  height?: number;
  title?: string;
};

// Spectral color scale for data visualization
const spectralColors = [
  '#8ECAE6', // Sky blue
  '#83C5BE', // Teal
  '#E9C46A', // Gold
  '#F4A261', // Orange
  '#E29578', // Amber
  '#00D9FF', // Cyan (chromatic)
  '#FF006E', // Magenta (chromatic)
];

// Dark theme for Nivo charts
const darkTheme = {
  background: 'transparent',
  text: {
    fontSize: 12,
    fill: '#A0A0A0',
    fontFamily: '"DM Sans", system-ui, sans-serif',
  },
  axis: {
    domain: {
      line: {
        stroke: 'rgba(255, 255, 255, 0.1)',
        strokeWidth: 0.5,
      },
    },
    ticks: {
      line: {
        stroke: 'rgba(255, 255, 255, 0.1)',
        strokeWidth: 0.5,
      },
      text: {
        fill: '#666666',
        fontSize: 11,
      },
    },
    legend: {
      text: {
        fill: '#A0A0A0',
        fontSize: 12,
        fontWeight: 500,
      },
    },
  },
  grid: {
    line: {
      stroke: 'rgba(255, 255, 255, 0.04)',
      strokeWidth: 0.5,
    },
  },
  crosshair: {
    line: {
      stroke: '#8ECAE6',
      strokeWidth: 1,
      strokeOpacity: 0.5,
    },
  },
  tooltip: {
    container: {
      background: '#1A1A1A',
      color: '#FAFAFA',
      fontSize: 12,
      borderRadius: '6px',
      boxShadow: '0 0 20px rgba(142, 202, 230, 0.2), 0 4px 20px rgba(0, 0, 0, 0.4)',
      border: '0.5px solid rgba(255, 255, 255, 0.1)',
    },
  },
};

export default function LineChart({
  data,
  xLegend = 'Time',
  yLegend = 'Value',
  height = 400,
  title,
}: LineChartProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative card-glow rounded-lg overflow-hidden"
      style={{ height: height + 40 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* Diffraction glow on hover */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(142, 202, 230, 0.1) 0%, transparent 50%)',
        }}
        animate={{
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1.2 : 1,
        }}
        transition={{ duration: 0.4 }}
      />

      {/* Chart container */}
      <div className="relative p-6" style={{ height }}>
        {title && (
          <h3 className="text-sm font-display font-medium text-luminous-secondary mb-4 tracking-wide uppercase">
            {title}
          </h3>
        )}
        <ResponsiveLine
          data={data}
          margin={{ top: 20, right: 30, bottom: 60, left: 70 }}
          xScale={{ type: 'point' }}
          yScale={{
            type: 'linear',
            min: 'auto',
            max: 'auto',
          }}
          colors={spectralColors}
          lineWidth={2}
          enableArea={true}
          areaOpacity={0.15}
          areaBlendMode="screen"
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 8,
            tickRotation: 0,
            legend: xLegend,
            legendOffset: 45,
            legendPosition: 'middle',
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 8,
            tickRotation: 0,
            legend: yLegend,
            legendOffset: -55,
            legendPosition: 'middle',
          }}
          pointSize={8}
          pointColor="#1A1A1A"
          pointBorderWidth={2}
          pointBorderColor={{ from: 'serieColor' }}
          pointLabelYOffset={-12}
          useMesh={true}
          enableSlices="x"
          theme={darkTheme}
          motionConfig="gentle"
          defs={[
            {
              id: 'gradientGlow',
              type: 'linearGradient',
              colors: [
                { offset: 0, color: '#8ECAE6', opacity: 0.4 },
                { offset: 100, color: '#E29578', opacity: 0 },
              ],
            },
          ]}
        />
      </div>

      {/* Bottom glow line */}
      <div className="absolute bottom-0 left-6 right-6 h-[0.5px] data-ray opacity-40" />
    </motion.div>
  );
}
