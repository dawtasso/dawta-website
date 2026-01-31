import { ResponsiveLine } from '@nivo/line';

const sampleData = [
  {
    id: 'series1',
    data: [
      { x: '2024-01', y: 12 },
      { x: '2024-02', y: 19 },
      { x: '2024-03', y: 15 },
      { x: '2024-04', y: 22 },
      { x: '2024-05', y: 18 },
      { x: '2024-06', y: 25 },
    ],
  },
];

export default function Report() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-medium mb-8 tracking-tight">Report</h1>
      
      <div className="bg-white border border-gray-200 p-8" style={{ height: '500px' }}>
        <ResponsiveLine
          data={sampleData}
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
            legend: 'Time',
            legendOffset: 40,
            legendPosition: 'middle',
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Value',
            legendOffset: -60,
            legendPosition: 'middle',
          }}
          pointSize={8}
          pointColor={{ theme: 'background' }}
          pointBorderWidth={2}
          pointBorderColor={{ from: 'serieColor' }}
          pointLabelYOffset={-12}
          useMesh={true}
          theme={{
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
          }}
        />
      </div>
    </div>
  );
}

