import { Column } from '@ant-design/plots';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs'; // For handling dates

type MonthData = {
  month: string;
  count: number;
};

type Props = {
  setPercentageChange: (change: number | null) => void;
};

export default function Graph({ setPercentageChange }: Props) {
  const [monthlyData, setMonthlyData] = useState<MonthData[]>([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_URL}/doc`)
      .then((response) => response.json())
      .then((data) => {
        const currentYear = dayjs().year();

        const months: MonthData[] = Array.from({ length: 12 }, (_, i) => ({
          month: dayjs().month(i).format('MMM'),
          count: 0,
        }));

        const currentYearDocuments = data.filter((doc: any) => {
          return dayjs(doc.create_at).year() === currentYear;
        });

        currentYearDocuments.forEach((doc: any) => {
          const docMonth = dayjs(doc.createdAt).month();
          months[docMonth].count += 1;
        });

        setMonthlyData(months);

        // Calculate percentage change for the current month vs previous month
        const currentMonthIndex = dayjs().month();
        const currentMonthCount = months[currentMonthIndex].count;
        const previousMonthCount = months[currentMonthIndex - 1]?.count || 0;

        if (previousMonthCount > 0) {
          const change = ((currentMonthCount - previousMonthCount) / previousMonthCount) * 100;
          setPercentageChange(change);
        } else {
          setPercentageChange(currentMonthCount > 0 ? 100 : null);
        }
      });
  }, [setPercentageChange]);

  const config = {
    data: monthlyData,
    xField: 'month',
    yField: 'count',
    group: false,
    autofit: true,
    label: {
      content: (d: any) => d.count > 0 ? `${d.count} เอกสาร` : '',
      style: {
        fill: '#4318FF'
      },
      position: 'middle',
    },
    columnStyle: (d: any) => {
      return d.count === 0 ? { fill: 'transparent' } : { fill: '#4318FF' };
    },
    style: {
      radius: 100,
      fill: '#4318FF',
      inset: 7,
    },
    xAxis: {
      title: {
        text: `Documents Created in ${dayjs().year()}`,
      },
    },
    yAxis: {
      title: {
        text: 'Document Count',
      },
      min: 0,
    },
  };

  return (
    <div style={{ height: '355px', overflow: 'hidden' }}>
      <Column {...config} />
    </div>
  );
}
