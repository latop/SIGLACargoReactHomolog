import { City, Country, State } from "./parameters";

type DriverAttribution = {
  id: string;
  driverId: string;
  attributionId: string;
  startDate: string;
  endDate: string;
};

type DriverBase = {
  id: string;
  driverId: string;
  locationGroupId: string;
  startDate: string;
  endDate: string;
};

type DriverFleet = {
  id: string;
  driverId: string;
  fleetGroupId: string;
  startDate: string;
  endDate: string;
};

type DriverPosition = {
  id: string;
  driverId: string;
  positionId: string;
  startDate: string;
  endDate: string;
};

type DriverVacation = {
  id: string;
  driverId: string;
  startDate: string;
  endDate: string;
};

export interface Driver {
  id: string;
  name: string;
  lastName: string;
  nickName: string;
  registration: string;
  seniority: number;
  identification: string;
  genre: string;
  birthdate: string;
  city?: City;
  state?: State;
  country?: Country;
  driverBase: string;
  driverBases: DriverBase[];
  driverVacations: DriverVacation[];
  driverFleets: DriverFleet[];
  driverPositions: DriverPosition[];
  driverAttributions: DriverAttribution[];
  driverSubBase: string;
  admission: string;
  resign: string | null;
  address: string;
  zipCode: string;
  district: string;
  cityId: string;
  stateId: string;
  countryId: string;
  email: string;
  phone1: string;
  phone2: string;
  note: string;
  isActive: boolean;
  integrationCode: string;
  integrationCodeGPS: string;
  urlPhoto: string | null;
  password: string | null;
}

export type DriversPaginated = {
  currentPage: number;
  hasNext: boolean;
  hasPrevious: boolean;
  pageSize: number;
  totalPages: number;
  drivers: Driver[];
  totalCount: number;
};

export interface Position {
  code: string;
  description: string;
  id: string;
  priority: number;
}
