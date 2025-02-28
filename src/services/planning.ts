import { Scenario, ScenarioResponse } from "@/interfaces/planning";
import axios from "axios";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;

export type FetchScenariosParams = {
  pageSize?: number;
  pageNumber?: number;
};

export async function fetchScenarios({ args }: { args: FetchScenariosParams }) {
  try {
    const params = {
      pageSize: args.pageSize,
      pageNumber: args.pageNumber,
    };

    const response = await axios.get(`/Scenario`, {
      params,
    });
    const pagination = response.headers["x-pagination"]
      ? JSON.parse(response.headers["x-pagination"])
      : {};
    const normalizeData: ScenarioResponse = {
      currentPage: pagination.CurrentPage || 1,
      hasNext: pagination.HasNext,
      hasPrevious: pagination.HasPrevious,
      pageSize: pagination.PageSize,
      totalPages: pagination.TotalPages,
      scenarios: response.data,
      totalCount: pagination.TotalCount,
    };
    return normalizeData;
  } catch (err) {
    throw new Error();
  }
}

export type FetchScenarioDetailParams = {
  id: string;
};

export async function fetchScenarioDetails({
  args: params,
}: {
  args: FetchScenarioDetailParams;
}) {
  try {
    const response = await axios.get(`/Scenario/${params.id}`);
    const data = response.data;
    return data;
  } catch (error) {
    throw new Error();
  }
}

export async function fetchScenarioCapacityDetails({
  args: params,
}: {
  args: FetchScenarioDetailParams;
}) {
  try {
    const response = await axios.get(`/ScenarioCapacity/${params.id}`);
    const data = response.data;
    return data;
  } catch (error) {
    throw new Error();
  }
}

export async function createScenario(scenario: Scenario) {
  try {
    const response = await axios.post(`/Scenario`, scenario);
    return response.data;
  } catch (error) {
    throw new Error();
  }
}
