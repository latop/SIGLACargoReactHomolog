import { ChartData } from "chart.js";
import React from "react";
import { Bar } from "react-chartjs-2";

interface Params {
  data: ChartData<"bar", (number | [number, number] | null)[], unknown>;
}

const BarChart = ({ data }: Params) => {
  return <Bar data={data} />;
};

export default BarChart;
