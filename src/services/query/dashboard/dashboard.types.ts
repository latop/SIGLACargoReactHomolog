import { CustomChartBarData } from "@/components/charts";

export interface ResumeData {
  [key: string]: (string | number)[];
}

export interface DashboardTripsAttrib {
  tripDate: string;
  tripTypeCode: string;
  qtyTrips: number;
  qtyTripsAttrib: number;
}

export interface DashboardTripsCompleted {
  tripDate: string;
  tripTypeCode: string;
  qtyTrips: number;
  qtyStarted: number;
  qtyCompleted: number;
}

export interface Dashboard {
  dashboardDemands: Record<string, string | number>[];
  dashboardTrips: Record<string, string | number>[];
  dashboardTripsAttrib: DashboardTripsAttrib[];
  dashboardTripsCompleted: DashboardTripsCompleted[];
}

export interface DashboardResponse {
  dashboardDemands?: CustomChartBarData;
  dashboardTrips?: CustomChartBarData;
  dashboardTripsAttrib?: CustomChartBarData;
  dashboardTripsCompleted?: CustomChartBarData;
}

export interface AgroupByFieldTransform {
  originalData: Record<string, string | number>[];
  groupFieldLabel: string;
  groupFieldName: string;
  groupFieldValue: string;
}
