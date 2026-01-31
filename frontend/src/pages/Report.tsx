import { PageHeader, PageLayout, LineChart } from '../components';

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
    <PageLayout maxWidth="6xl">
      <PageHeader
        title="Report"
        subtitle="Visual data analysis and insights"
      />
      <LineChart data={sampleData} xLegend="Month" yLegend="Value" />
    </PageLayout>
  );
}
