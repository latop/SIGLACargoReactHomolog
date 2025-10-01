import { Company, JustificationType } from "./parameters";
import { StopType, TripType } from "./trip";
import { FleetGroup, Truck } from "./vehicle";

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
  id: string;
  createAt: string | null;
  updateAt: string | null;
  userIdCreate: string | null;
  userIdUpdate: string | null;
  tripNumber: string;
  tripDate: string;
  fleetGroupId: string | null;
  fleetGroup: FleetGroup | null;
  flgStatus: string;
  notes: string | null;
  lineId: string | null;
  line: Line | null;
  dt: string | null;
  sto: string | null;
  locationOrigId: string | null;
  locationOrig: Location | null;
  locationDestId: string | null;
  locationDest: Location | null;
  startPlanned: string | null;
  endPlanned: string | null;
  startActual: string | null;
  endActual: string | null;
  startEstimated: string | null;
  endEstimated: string | null;
  tripTypeId: string | null;
  tripType: TripType | null;
  stopTypeId: string | null;
  stopType: StopType | null;
  companyId: string | null;
  company: Company | null;
  justificationId: string | null;
  justification: JustificationType | null;
  justificationMessage: string | null;
  locationGroupId: string | null;
  dailyTripSections: DailyTrip[];
  truck?: Truck;
  driverId?: string | null;
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
