import { useHash } from "@/hooks/useHash";
import { fetchOptmizedTrip } from "@/services/trips";
import useSWR from "swr";

export const useTripOptimizationDialog = () => {
  const [hash] = useHash();

  const match = (hash as string)?.match(/#otmId-(.+)/);
  const otmId = match?.[1];
  const { data, isLoading } = useSWR({ otmId }, fetchOptmizedTrip, {
    revalidateOnMount: true,
    revalidateIfStale: false,
  });

  return {
    data,
    isLoading,
  };
};
