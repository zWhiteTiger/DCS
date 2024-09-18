import { Column } from '@ant-design/plots';
import { useEffect, useState } from 'react';

type Props = {}

export default function Graph({ }: Props) {
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    // Fetch the data and filter it to include only entries with 'name' as 'London'
    fetch('https://gw.alipayobjects.com/os/antfincdn/iPY8JFnxdb/dodge-padding.json')
      .then((response) => response.json())
      .then((data) => {
        // Filter to include only entries where 'name' is 'London'
        const londonData = data.filter((item: any) => item.name === 'London');
        setFilteredData(londonData);
      });
  }, []);

  const config = {
    data: filteredData,
    xField: '月份',
    yField: '月均降雨量',
    group: false,
    autofit: true,
    label: {
      text: (d: any) => `${(d.月均降雨量).toFixed(1)}`,
      textBaseline: 'bottom',
    },
    style: {
      radius: 100,
      fill: '#4318FF',
      inset: 10,
    },
  };

  // Wrap the chart inside a div with fixed dimensions
  return (
    <div style={{ height: '355px', overflow: 'hidden' }}>
      <Column {...config} />
    </div>
  );
}
