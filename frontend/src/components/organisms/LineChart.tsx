import { ResponsiveLine } from '@nivo/line';

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
};

const defaultTheme = {
  axis: {
    ticks: {
      text: {
        fill: '#666',
        fontSize: 12,
      },
    },
    legend: {
      text: {
        fill: '#333',
        fontSize: 14,
        fontWeight: 500,
      },
    },
  },
  grid: {
    line: {
      stroke: '#e0e0e0',
      strokeWidth: 1,
    },
  },
};

export default function LineChart({
  data,
  xLegend = 'Time',
  yLegend = 'Value',
  height = 500,
}: LineChartProps) {
  return (
    <div className="bg-white border border-gray-200 p-8" style={{ height }}>
      <ResponsiveLine
        data={data}
        margin={{ top: 20, right: 20, bottom: 60, left: 80 }}
        xScale={{ type: 'point' }}
        yScale={{
          type: 'linear',
          min: 'auto',
          max: 'auto',
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: xLegend,
          legendOffset: 40,
          legendPosition: 'middle',
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: yLegend,
          legendOffset: -60,
          legendPosition: 'middle',
        }}
        pointSize={8}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        pointLabelYOffset={-12}
        useMesh={true}
        theme={defaultTheme}
      />
    </div>
  );
}

