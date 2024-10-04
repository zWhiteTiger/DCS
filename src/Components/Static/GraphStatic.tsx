import { Column } from '@ant-design/plots';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs'; // For handling dates

type MonthData = {
  month: string;
  count: number;
};

type Props = {};

export default function Graph({ }: Props) {
  // Set the type explicitly as an array of MonthData objects
  const [monthlyData, setMonthlyData] = useState<MonthData[]>([]);

  useEffect(() => {
    // Fetch document data from your API
    fetch(`${import.meta.env.VITE_URL}/doc`)
      .then((response) => response.json())
      .then((data) => {
        const currentYear = dayjs().year(); // Get the current year

        // Initialize an array with 12 months and set all counts to 0
        const months: MonthData[] = Array.from({ length: 12 }, (_, i) => ({
          month: dayjs().month(i).format('MMM'), // Format month name
          count: 0,
        }));

        // Filter documents for the current year
        const currentYearDocuments = data.filter((doc: any) => {
          return dayjs(doc.create_at).year() === currentYear;
        });

        // Count documents for each month
        currentYearDocuments.forEach((doc: any) => {
          const docMonth = dayjs(doc.createdAt).month(); // Get the month index (0-11)
          months[docMonth].count += 1; // Increment the count for the respective month
        });

        setMonthlyData(months); // Set the final data with counts for all months
      });
  }, []);

  // Configuration for the Column plot
  const config = {
    data: monthlyData,
    xField: 'month',
    yField: 'count',
    group: false,
    autofit: true,
    label: {
      // Only show labels for counts greater than 0 and append "เอกสาร" in Thai
      content: (d: any) => d.count > 0 ? `${d.count} เอกสาร` : '',
      style: {
        fill: '#4318FF'
      },
      position: 'middle', // Label in the middle of the bar
    },
    columnStyle: (d: any) => {
      // Hide the bar if the count is 0 (render it as an empty slot)
      return d.count === 0
        ? { fill: 'transparent' }  // Transparent bar for count 0
        : { fill: '#4318FF' };     // Blue color for other bars
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
      min: 0, // Ensure the Y-axis starts at 0
    },
  };

  return (
    <div style={{ height: '355px', overflow: 'hidden' }}>
      <Column {...config} />
    </div>
  );
}