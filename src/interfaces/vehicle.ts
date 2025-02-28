import { Driver } from "./driver";
import { LocationGroup } from "./trip";

export interface FleetGroup {
  description: string;
  code: string;
  id: string;
  qtyDemands: number;
}

export interface FleetType {
  code: string;
  description: string;
  fleetGroupId: string;
  fleetGroup: FleetGroup;
  fleetModelId: string;
  companyId: string;
  standardUnit: string;
  tare: number;
  capacity: number;
  note: string | null;
  fuelType: string;
  steeringGearType: string;
  id: string;
  createAt: string;
  updateAt: string;
  userIdCreate: string | null;
  userIdUpdate: string | null;
}

export interface Truck {
  startDate: string;
  endDate: string;
  id: string;
  isRefurbished: boolean;
  stateId: string;
  state: string | null;
  chassisNumber: string;
  licensePlate: string;
  regulatoryNumber: string;
  regulatoryValidity: string;
  manufactureYear: number;
  serialNumber: string;
  tare: number;
  fleetCode: string;
  capacity: number;
  locationGroupId: string;
  locationGroup: LocationGroup;
  fleetTypeId: string;
  fleetType: FleetType;
}

export interface IVehiclePlanning {
  id: string;
  driver: Driver;
  truck: Truck | null;
  truckId: string;
  startTime: string;
  endTime: string;
  startDate: string;
  endDate: string;
  freqTue: boolean;
  freqWed: boolean;
  freqThu: boolean;
  freqFri: boolean;
  freqSat: boolean;
  freqSun: boolean;
  freqMon: boolean;
}

export interface VehiclePlanningsResponse {
  hasNext: boolean;
  currentPage: number;
  vehiclePlannings: IVehiclePlanning[];
  pageSize: number;
  totalPages: number;
  totalCount: number;
  hasPrevious: boolean;
}
