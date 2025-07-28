import { useQuery } from "@tanstack/react-query";
import api from "../configs/api";
import dayjs from "dayjs";
import { PaginationResponse } from "@/interfaces/pagination";
import { FetchBasicParams } from "./trips";

const resource = "/Drivers";

export interface DriverReleaseFilterPayload extends FetchBasicParams {
  startDate: string;
  endDate: string;
  driverId?: string;
  activityId?: string;
  fleetGroupId?: string;
  locationGroupId?: string;
  flgStatus: string;
  page: number;
  pageSize: number;
}

export interface Driver {
  name: string;
  lastName: string;
  nickName: string;
  registration: string;
  seniority: string;
  identification: string;
  genre: string;
  birthdate: string;
  admission: string;
  resign: string;
  address: string;
  zipCode: string;
  district: string;
  cityId: string;
  city: string;
  stateId: string;
  state: string;
  countryId: string;
  email: string;
  phone1: string;
  phone2: string;
  note: string;
  isActive: boolean;
  integrationCode: string;
  integrationCodeGPS: string;
  urlPhoto: string;
  password: string;
  driverAttributions: string;
  driverBases: string;
  driverFleets: string;
  driverPositions: string;
  driverVacations: string;
  id: string;
  createAt: string;
  updateAt: string;
  userIdCreate: string;
  userIdUpdate: string;
}

export interface Activity {
  code: string;
  description: string;
  activityTypeId: string;
  start: string;
  end: string;
  flgActive: boolean;
  flgMeal: boolean;
  flgLunch: boolean;
  flgRest: boolean;
  flgRequest: boolean;
  id: string;
  createAt: string;
  updateAt: string;
  userIdCreate: string;
  userIdUpdate: string;
}

export interface DriverRequestResponse {
  driverId: string;
  driver: Driver;
  activityId: string;
  activity: Activity;
  requestDate: string;
  notes: string;
  requestFile: string;
  flgStatus: string;
  id: string;
  createAt: string;
  updateAt: string;
  userIdCreate: string;
  userIdUpdate: string;
}
export interface PaginationDriverRequestResponse extends PaginationResponse {
  data: DriverRequestResponse[];
}

export const useDriverRequestQuery = (props?: DriverReleaseFilterPayload) => {
  const enabledFlag =
    !!props &&
    (props.startDate ? true : false) &&
    (props.endDate ? true : false);

  return useQuery({
    queryKey: ["driver-request", props],
    queryFn: async (): Promise<PaginationDriverRequestResponse | Error> => {
      try {
        const {
          // pageSize = 15,
          startDate,
          endDate,
          flgStatus,
          // page,
          driverId,
          activityId,
          fleetGroupId,
          locationGroupId,
        } = props || {};

        const params = {
          DriverId: driverId,
          ActivityId: activityId,
          FleetGroupId: fleetGroupId,
          LocationGroupId: locationGroupId,
          StartDate: dayjs(startDate?.toString()).format("YYYY-MM-DD"),
          EndDate: dayjs(endDate?.toString()).format("YYYY-MM-DD"),
          FlgStatus: flgStatus?.trim() || undefined,
          // Page: (page || 0) + 1,
          // PageSize: pageSize,
          Page: 1,
          PageSize: 3000,
        };
        const response = await api.get(`${resource}/driverrequest`, {
          params,
        });
        return response.data;
      } catch (error) {
        console.error(error);
        return error as Error;
      }
    },
    enabled: enabledFlag,
  });
};
