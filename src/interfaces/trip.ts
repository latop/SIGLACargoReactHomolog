import { Timezone } from "@/services/query/parameters";
import { City } from "./parameters";

export interface LocationGroup {
  code: string;
  description: string;
  id: string;
}

export interface Location {
  name?: string;
  code: string;
  id?: string;
}

export interface Locations {
  code: string;
  codeIntegration1: string;
  codeIntegration2: string;
  name: string;
  cityId: string;
  city: City;
  latitude: number;
  longitude: number;
  locationTypeId: string;
  locationType: LocationType;
  timezoneId: string;
  timezone: Timezone;
  locationGroupId: string;
  locationGroup: LocationGroup;
  delayGPS: number;
  id: string;
}

export interface LocationType {
  code: string;
  description: string;
  isOperation: boolean;
  id: string;
  color: string;
}

export interface TripType {
  code: string;
  description: string;
  id: string;
  isLoaded: boolean;
  coloRGB: string;
}

export interface FetchOptmizedTripsData {
  process: string;
  status: string;
  driverLog: null;
  stoLog: null;
  id: string;
  createAt: string;
  updateAt: string | null;
  userIdCreate: string | null;
  userIdUpdate: string | null;
}

export type StopType = {
  stopTypeCode: string;
  stopTime: number;
  flgJourney: string;
  id: string;
};

export interface FetchLocationsParams {
  pageSize?: number;
  pageNumber?: number;
  locationGroupId?: string | null; // LocationGroupId //filter1Id
  locationTypeId?: string | null; // LocationTypeId // filter2Id
  cityId?: string | null; // CityId //filter3Id
  code?: string | null; // Code // filter1String
  codeIntegration1?: string | null; // CodeIntegration1 //filter2String
  codeIntegration2: string | null; // CodeIntegration2 // filter3String
  isOperation?: boolean | null; // IsOperation // filter1Bool
  isEnabled?: boolean | null; // to Filter with empty values
}

export interface LocationsPaginationResponse {
  currentPage: number;
  hasNext: boolean;
  hasPrevious: boolean;
  pageSize: number;
  totalPages: number;
  data: Locations[];
  totalCount: number;
}

export interface LocationType {
  code: string;
  description: string;
  isOperation: boolean;
  id: string;
}
