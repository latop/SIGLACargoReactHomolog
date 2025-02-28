import { generateRandomColor } from "@/utils";
import {
  AgroupByFieldTransform,
  DashboardTripsAttrib,
  DashboardTripsCompleted,
  ResumeData,
} from "./dashboard.types";
import { CustomChartBarData, CustomChartDataSet } from "@/components/charts";
import dayjs from "dayjs";

export const dashboardAgroupByFieldTransform = async ({
  originalData,
  groupFieldLabel,
  groupFieldName,
  groupFieldValue,
}: AgroupByFieldTransform): Promise<CustomChartBarData> => {
  return new Promise((resolve) => {
    const parsedData = originalData.map((item) => {
      return {
        ...item,
        [groupFieldLabel]: dayjs(item[groupFieldLabel]).format("DD/MM"),
      };
    });
    const labels = Array.from(
      new Set(parsedData.map((item) => item[groupFieldLabel])),
    );

    const groups = Array.from(
      new Set(parsedData.map((item) => item[groupFieldName])),
    );

    const resume = labels.reduce((total, label) => {
      const records = parsedData.filter(
        (data) => data[groupFieldLabel] === label,
      );
      groups.forEach((group) => {
        const exist = records.filter((data) => data[groupFieldName] === group);
        if (!total[group]) {
          total[group] = [];
        }
        let value = 0;
        if (exist.length > 0) {
          value = exist[0][groupFieldValue] as number;
        }

        total[group].push(value);
      });

      return total;
    }, {} as ResumeData);

    const datasets: CustomChartDataSet[] = [];
    groups.forEach((group) => {
      datasets.push({
        label: group.toString(),
        data: resume[group] as number[],
        backgroundColor: generateRandomColor(),
      });
    });

    resolve({ labels, datasets });
  });
};

export const dashboardTripsAttribTransform = async (
  originalData: DashboardTripsAttrib[],
): Promise<CustomChartBarData> => {
  return new Promise((resolve) => {
    const labels = Array.from(
      new Set(originalData.map((item) => dayjs(item.tripDate).format("DD/MM"))),
    );

    const datasets: CustomChartDataSet[] = [];

    const resume = originalData.reduce(
      (total, item) => {
        total.trips.push(item.qtyTrips);
        total.attrib.push(item.qtyTripsAttrib);
        return total;
      },
      { trips: [] as number[], attrib: [] as number[] },
    );

    datasets.push({
      label: "Viagens",
      data: [...resume.trips],
      backgroundColor: generateRandomColor(),
    });

    datasets.push({
      label: "Atribuidas",
      data: [...resume.attrib],
      backgroundColor: generateRandomColor(),
    });

    resolve({ labels, datasets });
  });
};

export const dashboardTripsCompletedTransform = async (
  originalData: DashboardTripsCompleted[],
): Promise<CustomChartBarData> => {
  return new Promise((resolve) => {
    const labels = Array.from(
      new Set(originalData.map((item) => dayjs(item.tripDate).format("DD/MM"))),
    );

    const datasets: CustomChartDataSet[] = [];

    const resume = originalData.reduce(
      (total, item) => {
        total.trips.push(item.qtyTrips);
        total.started.push(item.qtyStarted);
        total.completed.push(item.qtyCompleted);
        return total;
      },
      {
        trips: [] as number[],
        started: [] as number[],
        completed: [] as number[],
      },
    );

    datasets.push({
      label: "Viagens",
      data: [...resume.trips],
      backgroundColor: generateRandomColor(),
    });

    datasets.push({
      label: "Iniciadas",
      data: [...resume.started],
      backgroundColor: generateRandomColor(),
    });

    datasets.push({
      label: "Completas",
      data: [...resume.completed],
      backgroundColor: generateRandomColor(),
    });
    resolve({ labels, datasets });
  });
};
