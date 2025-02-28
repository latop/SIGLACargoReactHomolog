import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";

import { Bar } from "react-chartjs-2";
import { CustomChartBarData } from ".";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

interface Params {
  labels: string[];
  data: CustomChartBarData;
  title: string;
}

const StackedBars = ({ data, title }: Params) => {
  const options = {
    responsive: true,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
    plugins: {
      legend: {
        position: "bottom" as const,
      },
    },
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <h2 style={{ marginBottom: 10 }}>{title}</h2>
      <Bar options={options} data={data} />
    </div>
  );
};

export default StackedBars;
