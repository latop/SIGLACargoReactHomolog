import { Location } from "./trip";

export interface DriverSchedule {
  driverId: string;
  driverName: string;
}

export interface Trip {
  id?: string;
  code?: string;
  circuitCode?: string;
  startPlanned: string;
  endPlanned: string;
  driverId: string;
  colorRGB?: string;
  licensePlate?: string;
  driverName: string;
  demand?: string;
  locationDestCode?: string;
  locationOrig?: Location;
  locationDest?: Location;
  tripType: "STOP" | "TRIP" | "TRIP EXEC";
  locationOrigCode?: string;
}

export interface TaskDriver {
  seq: number;
  demand?: string;
  lineCode?: string;
  type: string;
  activityId?: string;
  activityCode?: string;
  locOrig?: string;
  locDest?: string;
  startPlanned?: string;
  endPlanned?: string;
  lineId?: string;
  startActual?: string;
  endActual?: string;
  sectionsReturn?: DailyTripSection[];
}

export interface Circuit {
  ciruictCode?: string | null;
  endDate: string;
  startDate: string;
  trips: Trip[];
  driverName?: string;
  driverId: string;
}

export interface JourneysByPeriodResponse {
  drivers: DriverSchedule[];
  trips: Trip[];
  circuits: Circuit[];
  hasNext: boolean;
  currentPage: number;
}

export interface Truck {
  truckId: string;
  licensePlate: string;
  fleetGroupCode: string;
}

export interface DailyTripsByPeriodResponse {
  trips: Trip[];
  trucks: Truck[];
  hasNext: boolean;
  currentPage: number;
}

export interface DriverJourneySchedule {
  type: string;
  task: string;
  locCodeOrig: string | null;
  locCodeDest: string | null;
  lineCode: string | null;
  licensePlate: string | null;
  startPlanned: string;
  endPlanned: string;
  startActual: string | null;
  endActual: string | null;
}

export interface CircuitJourney {
  circuitJourneyId?: string | null;
  ciruictCode?: string;
  driverId: string;
  nickName: string;
  driverBase?: string;
  driverSubBase?: string;
  fleetCode?: string;
  startDate?: string;
  endDate?: string;
  otmProcess?: string;
  tasksDriver?: TaskDriver[] | null;
}

export interface ActivityRequest {
  journeyDate: string;
  driverId: string;
  activityId: string;
  startActivity: string;
  endActivity: string;
  qtyOccur: number;
  operation: string | null;
}

export interface DailyTripSection {
  dailyTripSectionId: string;
  dailyTripId: string;
  section: number;
  locOrig: string;
  locDest: string;
  startPlanned: string;
  endPlanned: string;
  startActual: string | null;
  endActual: string | null;
  startEstimated: string;
  endEstimated: string;
  licensePlate: string | null;
  flgStatus: string;
}

export interface DailyTripUnallocated {
  dailyTripId: string;
  tripNumber: string;
  tripDate: string;
  fleetGroupCode: string | null;
  flgStatus: string;
  sto: string;
  sectionsUnallocated: DailyTripSection[];
  selected?: boolean;
  startPlanned?: string;
  endPlanned?: string;
}

export interface DeparturesArrivals {
  timePlanned: string;
  locCode: string;
  sto: string;
  dt: string | null;
  statusTrip: string;
  timeEstimated: string;
  truckFleetCode: string | null;
  nickName: string;
  direction: string;
}

export interface DailyTrip {
  dailyTripId: string;
  tripNumber: string;
  tripDate: string;
  fleetGroupCode: string | null;
  lineCode: string;
  flgStatus: string;
  sto: string;
  locationOrigCode: string;
  locationDestCode: string;
  startPlanned: string;
  endPlanned: string;
  sectionsReturn: DailyTripSection[];
}
