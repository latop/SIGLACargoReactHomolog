import { BubbleDataPoint, ChartData, ChartDataset, Point } from "chart.js";

export * from "./horizontalBars.charts";
export * from "./stackedBars.chart";

export interface ChartDataSet {
  label?: string | number;
  data?: (string | number)[];
}

export type CustomChartBarData = ChartData<
  "bar",
  (number | [number, number] | Point | BubbleDataPoint | null)[],
  unknown
>;

export type CustomChartDataSet = ChartDataset<
  "bar",
  (number | [number, number] | Point | BubbleDataPoint | null)[]
>;
