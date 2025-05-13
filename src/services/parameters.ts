import axios from "axios";
import api from "./configs/api";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;

export interface FetchActivitiesParams {
  pageSize?: number;
  code?: string;
}

export interface FetchPositionParams {
  pageSize?: number;
  code?: string;
}

export interface FetchAttribuitionParams {
  pageSize?: number;
  code?: string;
  pageNumber?: number;
}

export interface FetchCitiesParams {
  cityName?: string;
  pageSize?: number;
  stateId?: string;
  pageNumber?: number;
}

export interface FetchStatesParams {
  stateName?: string;
  pageSize?: number;
  pageNumber?: number;
}

export interface FetchResponsibleSectionsParams {
  pageSize?: number;
  pageNumber?: number;
}

export interface FetchJustificationsParams {
  pageSize?: number;
  pageNumber?: number;
  responsibleSectorId?: string; // Filter1Id
  code?: string; // Filter1String
  type?: string; // Filter2String
}

export interface FetchActivityTypeParams {
  pageSize?: number;
  pageNumber?: number;
  code?: string; // Filter1String
  type?: string; // Filter2String
}

export interface FetchActivityParams {
  pageSize?: number;
  pageNumber?: number;
  code?: string; // Filter1String
  activityTypeId?: string; // Filter1Id
  flgActive?: boolean | string; // Filter1Bool
  flgRequest?: boolean | string; // Filter1Bool
}

export interface FetchActivityTruckParams {
  pageSize?: number;
  code?: string;
}

export interface FetchStates {
  stateName?: string;
  pageSize?: number;
  pageNumber?: number;
}

export interface FetchRegionsParams {
  pageSize?: number;
  pageNumber?: number;
  regionName?: string;
}

export interface FetchTimezoneValueParams {
  pageSize?: number;
  pageNumber?: number;
  timezoneId?: string;
}

export async function fetchAcitivities({
  args: params,
}: {
  args: FetchActivitiesParams;
}) {
  try {
    const activitiesParams = {
      PageSize: params.pageSize,
      filter1String: params.code?.toUpperCase(),
    };

    const response = await axios.get("/Activity", { params: activitiesParams });
    const data = response.data;
    return data;
  } catch (error) {
    console.error(error);
    return error;
  }
}

export interface FetchCompanyParams {
  pageSize?: number;
  code?: string;
}

export async function fetchCompanies({ args }: { args: FetchCompanyParams }) {
  try {
    const params = {
      PageSize: args.pageSize,
      filter1String: args.code?.toUpperCase(),
    };

    const response = await api.get("/Companies", { params });
    const data = response.data;
    return data;
  } catch (error) {
    console.error(error);
    return error;
  }
}

export const fetchCountries = async () => {
  try {
    const response = await api.get("/Countries");
    const data = response.data;
    return data;
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const fetchStates = async ({
  args: params,
}: {
  args: FetchStatesParams;
}) => {
  const statesParams = {
    pageSize: params.pageSize,
    stateName: params.stateName,
    pageNumber: params.pageNumber,
  };

  try {
    const response = await api.get("/States", { params: statesParams });

    const data = response.data;
    return data;
  } catch (error) {
    console.error(error);
    return error;
  }
};

export async function fetchPositions({
  args: params,
}: {
  args: FetchPositionParams;
}) {
  try {
    const positionParams = {
      PageSize: params.pageSize,
      filter1String: params.code?.toUpperCase(),
    };
    const response = await api.get("/Position", {
      params: positionParams,
    });
    const data = response.data;
    return data;
  } catch (error) {
    console.error(error);
    return error;
  }
}

export async function fetchAttribuitions({
  args: params,
}: {
  args: FetchAttribuitionParams;
}) {
  try {
    const attributionParams = {
      PageSize: params.pageSize,
      filter1String: params.code?.toUpperCase(),
      PageNumber: params.pageNumber,
    };
    const response = await api.get("/Attribution", {
      params: attributionParams,
    });
    const data = response.data;
    return data;
  } catch (error) {
    console.error(error);
    return error;
  }
}

export async function fetchCities({
  args: params,
}: {
  args: FetchCitiesParams;
}) {
  console.log("fetchCities", params);
  try {
    const citiesParams = {
      PageSize: params.pageSize,
      PageNumber: params.pageNumber,
      filter1String: params.cityName?.toUpperCase(),
      filter2Id: params.stateId,
    };
    const response = await api.get("/Cities", { params: citiesParams });
    const data = response.data;
    return data;
  } catch (error) {
    console.error(error);
    return error;
  }
}

export async function fetchResponsibleSectors({
  args: params,
}: {
  args: FetchResponsibleSectionsParams;
}) {
  const responsibleSectionsParams = {
    PageSize: params.pageSize,
    PageNumber: params.pageNumber,
  };
  try {
    const response = await api.get("/ResponsibleSector", {
      params: responsibleSectionsParams,
    });
    const data = response.data;
    return data;
  } catch (error) {
    console.error(error);
    return error;
  }
}

export async function fetchResponsibleSectorById({ id }: { id: string }) {
  try {
    const response = await api.get(`/ResponsibleSector/${id}`);
    const data = response.data;
    return data;
  } catch (error) {
    console.error(error);
    return error;
  }
}

export async function fetchJustifications({
  args: params,
}: {
  args: FetchJustificationsParams;
}) {
  const justificationsParams = {
    PageSize: params.pageSize,
    PageNumber: params.pageNumber,
    Filter1String: params?.code,
    Filter2String: params?.type,
    Filter1Id: params?.responsibleSectorId,
  };

  try {
    const response = await api.get("/Justification", {
      params: justificationsParams,
    });
    const data = response.data;
    return data;
  } catch (error) {
    console.error(error);
    return error;
  }
}

export async function fetchJustificationById({ id }: { id: string }) {
  try {
    const response = await api.get(`/Justification/${id}`);
    const data = response.data;
    return data;
  } catch (error) {
    console.error(error);
    return error;
  }
}

export async function fetchActivityType({
  args: params,
}: {
  args: FetchActivityTypeParams;
}) {
  const activityTypeParams = {
    PageSize: params.pageSize,
    PageNumber: params.pageNumber,
    Filter1String: params?.code,
    Filter2String: params?.type,
  };
  try {
    const response = await api.get("/ActivityType", {
      params: activityTypeParams,
    });
    const data = response.data;
    return data;
  } catch (error) {
    console.error(error);
    return error;
  }
}

export async function fetchActivityTypeById({ id }: { id: string }) {
  try {
    const response = await api.get(`/ActivityType/${id}`);
    const data = response.data;
    return data;
  } catch (error) {
    console.error(error);
    return error;
  }
}

export async function fetchActivity({
  args: params,
}: {
  args: FetchActivityParams;
}) {
  const activityParams = {
    PageSize: params.pageSize,
    PageNumber: params.pageNumber,
    Filter1String: params?.code,
    Filter1Id: params?.activityTypeId,
    Filter1Bool: params?.flgRequest !== "all" ? params?.flgRequest : undefined,
    Filter2Bool:
      params?.flgActive !== "undefined" ? params?.flgActive : undefined,
  };

  try {
    const response = await api.get("/Activity", {
      params: activityParams,
    });
    const data = response.data;
    return data;
  } catch (error) {
    console.error(error);
    return error;
  }
}

export async function fetchActivityById({ id }: { id: string }) {
  try {
    const response = await api.get(`/Activity/${id}`);
    const data = response.data;
    return data;
  } catch (error) {
    console.error(error);
    return error;
  }
}

export async function fetchAttribuitionById({ id }: { id: string }) {
  try {
    const response = await api.get(`/Attribution/${id}`);
    const data = response.data;
    return data;
  } catch (error) {
    console.error(error);
    return error;
  }
}

export async function fetchPositionById({ id }: { id: string }) {
  try {
    const response = await api.get(`/Position/${id}`);
    const data = response.data;
    return data;
  } catch (error) {
    console.error(error);
    return error;
  }
}

export async function fetchActivityTrucks({
  args: params,
}: {
  args: FetchActivityTruckParams;
}) {
  try {
    const activityTruckParams = {
      PageSize: params.pageSize,
      filter1String: params.code?.toUpperCase(),
    };
    const response = await api.get("/ActivityTruck", {
      params: activityTruckParams,
    });
    const data = response.data;
    return data;
  } catch (error) {
    console.error(error);
    return error;
  }
}

export async function fetchActivityTruckById({ id }: { id: string }) {
  try {
    const response = await api.get(`/ActivityTruck/${id}`);
    const data = response.data;
    return data;
  } catch (error) {
    console.error(error);
    return error;
  }
}

export async function fetchCityById({ id }: { id: string }) {
  try {
    const response = await api.get(`/Cities/${id}`);
    const data = response.data;
    return data;
  } catch (error) {
    console.error(error);
    return error;
  }
}

export async function fetchStateById({ id }: { id: string }) {
  try {
    const response = await api.get(`/States/${id}`);
    const data = response.data;
    return data;
  } catch (error) {
    console.error(error);
    return error;
  }
}

export async function fetchRegionById({ id }: { id: string }) {
  try {
    const response = await api.get(`/Regions/${id}`);
    const data = response.data;
    return data;
  } catch (error) {
    console.error(error);
    return error;
  }
}

export async function fetchRegions({
  args: params,
}: {
  args: FetchRegionsParams;
}) {
  try {
    const response = await api.get("/Regions", {
      params: params,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return error;
  }
}

export async function fetchCountryById({ id }: { id: string }) {
  try {
    const response = await api.get(`/Countries/${id}`);
    const data = response.data;
    return data;
  } catch (error) {
    console.error(error);
    return error;
  }
}

export async function fetchCompanyById({ id }: { id: string }) {
  try {
    const response = await api.get(`/Companies/${id}`);
    const data = response.data;
    return data;
  } catch (error) {
    console.error(error);
    return error;
  }
}

export const fetchTimezones = async () => {
  try {
    const response = await api.get("/Timezone");
    const data = response.data;
    return data;
  } catch (error) {
    console.error(error);
    return error;
  }
};

export async function fetchTimezoneById({ id }: { id: string }) {
  try {
    const response = await api.get(`/Timezone/${id}`);
    const data = response.data;
    return data;
  } catch (error) {
    console.error(error);
    return error;
  }
}

export const fetchTimezoneValues = async ({
  args: params,
}: {
  args: FetchTimezoneValueParams;
}) => {
  try {
    const timezoneValueParams = {
      PageSize: params.pageSize,
      PageNumber: params.pageNumber,
      Filter1Id: params.timezoneId,
    };
    const response = await api.get("/TimezoneValue", {
      params: timezoneValueParams,
    });
    const data = response.data;
    return data;
  } catch (error) {
    console.error(error);
    return error;
  }
};

export async function fetchTimezoneValueById({ id }: { id: string }) {
  try {
    const response = await api.get(`/TimezoneValue/${id}`);
    const data = response.data;
    return data;
  } catch (error) {
    console.error(error);
    return error;
  }
}
