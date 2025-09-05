import { FleetGroup } from "./vehicle";

export interface Line {
  id: string;
  code: string;
  description: string;
  companyId: string;
  createAt: string;
  updateAt: string | null;
  userIdCreate: string | null;
  userIdUpdate: string | null;
}

export interface DailyTrip {
  tripNumber: string;
  tripDate: string;
  fleetGroup: FleetGroup | null;
  fleetGroupId: string | null;
  flgStatus: string;
  notes: string | null;
  lineId: string | null;
  line: Line;
  dt: string | null;
  sto: string;
  locationOrigId: string | null;
  locationOrig: {
    code: string;
    description: string;
  } | null;
  driverId: string | null;
  locationDestId: string | null;
  locationDest: {
    code: string;
    description: string;
  } | null;
  startPlanned: string | null;
  endPlanned: string | null;
  startEstimated: string | null;
  endEstimated: string | null;
  tripTypeId: string | null;
  tripType: {
    code: string;
    description: string;
  } | null;
  stopTypeId: string | null;
  stopType: {
    code: string;
    description: string;
  } | null;
  companyId: string | null;
  id: string;
  createAt: string;
  updateAt: string | null;
  userIdCreate: string | null;
  userIdUpdate: string | null;
  dailyTripSections: DailyTrip[];
  justificationId?: string | null;
}

export interface DailyTripResponse {
  hasNext: boolean;
  currentPage: number;
  dailyTrips: DailyTrip[];
  pageSize: number;
  totalPages: number;
  totalCount: number;
  hasPrevious: boolean;
}

export interface DailyTripDetailsResponse {
  dailyTrip: DailyTrip;
  dailyTripSections: DailyTrip[];
}
