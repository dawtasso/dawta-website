import { ResponsiveLine } from '@nivo/line';
import { motion } from 'framer-motion';

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

// Earthy, natural color scale
const earthColors = [
  '#4A6741', // Forest
  '#7A9A7A', // Sage
  '#8B7355', // Clay
  '#C4785A', // Terracotta
  '#5B8A9A', // River
  '#7BA3B5', // Sky
];

// Warm, readable theme
const warmTheme = {
  background: 'transparent',
  text: {
    fontSize: 12,
    fill: '#6B6B6B',
    fontFamily: '"Source Sans 3", system-ui, sans-serif',
  },
  axis: {
    domain: {
      line: {
        stroke: 'rgba(0, 0, 0, 0.08)',
        strokeWidth: 1,
      },
    },
    ticks: {
      line: {
        stroke: 'rgba(0, 0, 0, 0.08)',
        strokeWidth: 1,
      },
      text: {
        fill: '#6B6B6B',
        fontSize: 11,
      },
    },
    legend: {
      text: {
        fill: '#3D3D3D',
        fontSize: 12,
        fontWeight: 500,
      },
    },
  },
  grid: {
    line: {
      stroke: 'rgba(0, 0, 0, 0.04)',
      strokeWidth: 1,
    },
  },
  crosshair: {
    line: {
      stroke: '#7A9A7A',
      strokeWidth: 1,
      strokeOpacity: 0.6,
    },
  },
  tooltip: {
    container: {
      background: 'white',
      color: '#1A1A1A',
      fontSize: 12,
      borderRadius: '3px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      border: '1px solid rgba(0, 0, 0, 0.08)',
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
  return (
    <motion.div
      className="card-editorial overflow-hidden"
      style={{ height: height + 40 }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="p-6" style={{ height }}>
        {title && (
          <h3 className="text-xs font-body font-medium text-ink-muted mb-4 uppercase tracking-wider">
            {title}
          </h3>
        )}
        <ResponsiveLine
          data={data}
          margin={{ top: 20, right: 30, bottom: 60, left: 60 }}
          xScale={{ type: 'point' }}
          yScale={{
            type: 'linear',
            min: 'auto',
            max: 'auto',
          }}
          colors={earthColors}
          lineWidth={2}
          enableArea={true}
          areaOpacity={0.08}
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
            legendOffset: -50,
            legendPosition: 'middle',
          }}
          pointSize={6}
          pointColor="white"
          pointBorderWidth={2}
          pointBorderColor={{ from: 'serieColor' }}
          pointLabelYOffset={-12}
          useMesh={true}
          enableSlices="x"
          theme={warmTheme}
          motionConfig="gentle"
        />
      </div>
    </motion.div>
  );
}
