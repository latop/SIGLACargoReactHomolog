import axios from "axios";
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
}

export interface FetchCitiesParams {
  cityName?: string;
  pageSize?: number;
}

export interface FetchStatesParams {
  stateName?: string;
  pageSize?: number;
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
    const response = await axios.get("/Position", {
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
    };
    const response = await axios.get("/Attribution", {
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
