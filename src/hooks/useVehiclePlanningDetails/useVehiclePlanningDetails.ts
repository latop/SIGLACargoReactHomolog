import useSWR, { SWRConfiguration } from "swr";
import { useFetch } from "../useFetch";
import { IVehiclePlanning } from "@/interfaces/vehicle";
import { fetchVehiclePlanningDetails } from "@/services/vehicles";

export interface DailyTripDetailsParams {
  id?: string;
}

export const useVehiclePlanningDetails = (
  params?: DailyTripDetailsParams,
  options?: SWRConfiguration,
) => {
  const [create] = useFetch();
  const { data, error, isLoading, mutate } = useSWR<IVehiclePlanning>(
    params?.id ? { url: "/vehicle-planning-details", args: params } : null,
    fetchVehiclePlanningDetails,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      ...options,
    },
  );

  const updateVehiclePlanning = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body: any,
    options?: {
      onSuccess?: () => void;
      onError?: () => void;
    },
  ) => {
    return create("/TruckAssignmentPlan", body, {
      onSuccess: options?.onSuccess,
      onError: options?.onError,
      method: "put",
    });
  };

  const createVehiclePlanning = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body: any,
    options?: {
      onSuccess?: () => void;
      onError?: () => void;
    },
  ) => {
    return create("/TruckAssignmentPlan", body, {
      onSuccess: options?.onSuccess,
      onError: options?.onError,
      method: "post",
    });
  };

  const deleteVehiclePlanning = (
    id?: string,
    options?: {
      onSuccess?: () => void;
      onError?: () => void;
    },
  ) => {
    return create(`/TruckAssignmentPlan/${id}`, id, {
      onSuccess: options?.onSuccess,
      onError: options?.onError,
      method: "delete",
    });
  };

  const refetch = () => {
    mutate();
  };

  return {
    vehiclePlanningDetails: data,
    updateVehiclePlanning,
    createVehiclePlanning,
    deleteVehiclePlanning,
    error,
    isLoading,
    refetch,
  };
};
