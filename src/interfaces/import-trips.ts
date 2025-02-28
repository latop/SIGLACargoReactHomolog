import { Dayjs } from "dayjs";

export type FetchImportTripsParams = {
  startDate: Dayjs | null;
  endDate: Dayjs | null;
};

export type ImportTripsResponseItem = {
  FileName: string;
  LocationCode: string;
  Id: string;
  CreateAt: Dayjs;
  UpdateAt?: string;
  UserIdCreate?: string | null;
  UserIdUpdate?: string | null;
};

export type ImportTripsResponses = ImportTripsResponseItem[];
