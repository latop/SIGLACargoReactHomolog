import { Location, TripType } from "./trip";
import { FleetGroup } from "./vehicle";

export interface Line {
  line: {
    code: string;
    description: string;
    startDate: string;
    endDate: string;
    freqMon: boolean;
    freqTue: boolean;
    freqWed: boolean;
    freqThu: boolean;
    freqFri: boolean;
    freqSat: boolean;
    freqSun: boolean;
    locationOrigId: string;
    locationDestId: string;
    cost: number;
    fleetGroupId: string;
    overtimeAllowed: number;
    locationOrig: Location;
    locationDest: Location;
    fleetGroup: FleetGroup;
    tripTypeId: string;
    tripType: TripType;
    id: string;
  };
  lineSections?: LineSection[];
}

export interface LineSection {
  lineId: string;
  section: number;
  locationOrigId: string;
  locationDestId: string;
  duration: number;
  locationOrig: Location;
  locationDest: Location;
  stopTypeId: string;
  stopType: StopType;
  locationGroupId: string | null;
  id: string;
  createAt: string;
  updateAt: string | null;
  userIdCreate: string | null;
  userIdUpdate: string | null;
}

interface StopType {
  stopTypeCode: string;
  stopTime: number;
  flgJourney: string;
  id: string;
  createAt: string;
  updateAt: string | null;
  userIdCreate: string | null;
  userIdUpdate: string | null;
}
export interface LinesPaginated {
  hasNext: boolean;
  currentPage: number;
  lines: Line[];
  pageSize: number;
  totalPages: number;
  totalCount: number;
  hasPrevious: boolean;
}
