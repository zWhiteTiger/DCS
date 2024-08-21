import { Scatter } from '@ant-design/plots';
type Props = {}

export default function Graph({}: Props) {
    const config = {
        data: {
          type: 'fetch',
          value: 'https://gw.alipayobjects.com/os/bmw-prod/88c601cd-c1ff-4c9b-90d5-740d0b710b7e.json',
        },
        height: 354,
        autoFit: true,
        stack: {
          y1: 'y',
        },
        xField: (d: any) => 2021 - d.birth,
        yField: (d: any) => (d.gender === 'M' ? 1 : -1),
        colorField: 'gender',
        shapeField: 'point',
        scale: {
          x: { nice: true },
        },
        axis: {
          y: {
            labelFormatter: (d: any) => `${Math.abs(+d)}`,
          },
        },
        legend: { color: { title: 'Gender' } },
        tooltip: { items: [{ channel: 'x', name: 'age' }] },
        annotations: [{ type: 'lineY', data: [0], style: { stroke: 'black' } }],
      };
      return <Scatter {...config} />;
}