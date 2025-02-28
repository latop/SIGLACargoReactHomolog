import Error from "next/error";
import { Dashboard, DashboardResponse } from "./dashboard.types";
import {
  dashboardAgroupByFieldTransform,
  dashboardTripsAttribTransform,
  dashboardTripsCompletedTransform,
} from "./dashboard.utils";
import api from "@/services/configs/api";

const getDashboard = async (): Promise<DashboardResponse> => {
  try {
    const response = await api.get("/dashboard/GetDashboardInfo");
    const data: Dashboard = response.data;

    const dashboardDemands = await dashboardAgroupByFieldTransform({
      originalData: data.dashboardDemands,
      groupFieldLabel: "demandDate",
      groupFieldName: "locationCode",
      groupFieldValue: "qtyDemands",
    });

    const dashboardTrips = await dashboardAgroupByFieldTransform({
      originalData: data.dashboardTrips,
      groupFieldLabel: "tripDate",
      groupFieldName: "tripTypeCode",
      groupFieldValue: "qtyTrips",
    });

    const dashboardTripsAttrib = await dashboardTripsAttribTransform(
      data.dashboardTripsAttrib,
    );

    const dashboardTripsCompleted = await dashboardTripsCompletedTransform(
      data.dashboardTripsCompleted,
    );

    return {
      dashboardDemands,
      dashboardTrips,
      dashboardTripsAttrib,
      dashboardTripsCompleted,
    };
  } catch (error) {
    const err = error as Error;
    console.error(err);
    return {};
  }
};

export const useGetDashboardQuery = {
  queryKey: ["dashboard"],
  queryFn: getDashboard,
};
