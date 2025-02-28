import { fetchOptmizedTrips } from "@/services/trips";
import useSWR from "swr";
import { useFetch } from "../useFetch";
import { useToast } from "../useToast";

export const useTripOptimization = () => {
  const [create] = useFetch();
  const { addToast } = useToast();

  const {
    data: optmizedTrips,
    mutate,
    isLoading,
  } = useSWR({ url: "/trip-optimization" }, fetchOptmizedTrips);

  const handleOptmizeTrip = async (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    params: any,
    options?: {
      onSuccess?: () => void;
      onError?: () => void;
    },
  ) => {
    await create("/Optimizer/GenerateScheduleCircuit", params, {
      ...options,
      method: "get",
    });
  };
  const handleDeleteOptmitzationTrip = async (otmId: string) => {
    const body = { otmId };

    return await create(`/Optimizer/removeotm?otmId=${otmId}`, body, {
      method: "delete",
      onSuccess: () => {
        addToast("Removido com sucesso!" + " " + otmId, { type: "success" });
        mutate();
      },
      onError: () => {
        addToast("Erro ao remover, tente novamente", { type: "success" });
        mutate();
      },
    });
  };

  return {
    optmizedTrips,
    mutate,
    isLoading,
    handleOptmizeTrip,
    handleDeleteOptmitzationTrip,
  };
};
