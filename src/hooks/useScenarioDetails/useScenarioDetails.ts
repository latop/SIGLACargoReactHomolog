import { Scenario, ScenarioCapacity } from "@/interfaces/planning";
import {
  fetchScenarioDetails,
  fetchScenarioCapacityDetails,
} from "@/services/planning";
import useSWR, { SWRConfiguration } from "swr";

export interface ScenarioDetailsParams {
  id?: string;
}

export const useScenarioDetails = (
  params: ScenarioDetailsParams,
  options?: SWRConfiguration,
) => {
  const {
    data: scenarioDetails,
    error: errorScenario,
    isLoading: loadingScenario,
  } = useSWR<Scenario>(
    params.id ? { url: "/scenario-details", args: params } : null,
    fetchScenarioDetails,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      ...options,
    },
  );

  const {
    data: scenarioCapacities,
    error: errorCapacities,
    isLoading: loadingCapacities,
  } = useSWR<ScenarioCapacity[]>(
    params.id ? { url: "/scenario-capacity", args: params } : null,
    fetchScenarioCapacityDetails,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      ...options,
    },
  );

  return {
    scenarioDetails,
    scenarioCapacities,
    error: errorScenario || errorCapacities,
    isLoading: loadingScenario || loadingCapacities,
  };
};
