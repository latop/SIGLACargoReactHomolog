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
}

export interface FetchStatesParams {
  stateName?: string;
  pageSize?: number;
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

    const response = await axios.get("/Companies", { params });
    const data = response.data;
    return data;
  } catch (error) {
    console.error(error);
    return error;
  }
}

export const fetchCountries = async () => {
  try {
    const response = await axios.get("/Countries");
    const data = response.data;
    return data;
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const fetchStates = async ({
  args: { pageSize = 0 },
}: {
  args: FetchStatesParams;
}) => {
  const statesParams = {
    pageSize,
  };

  try {
    const response = await axios.get("/States", { params: statesParams });

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
  try {
    const citiesParams = {
      PageSize: params.pageSize,
      filter1String: params.cityName?.toUpperCase(),
    };
    const response = await axios.get("/Cities", { params: citiesParams });
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
