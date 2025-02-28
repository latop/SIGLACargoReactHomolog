import { useCircuit } from "@/hooks/useCircuit";
import { fetchCircuitTimesDetails } from "@/services/schedule";
import useSWR from "swr";

export const useJourneyCircuitTimesDialog = () => {
  const { circuit } = useCircuit();
  const params = {
    idCircuit: circuit?.circuitJourneyId,
  };

  const { data } = useSWR(
    {
      args: params,
      url: "/journey",
    },
    fetchCircuitTimesDetails,
  );

  return {
    circuitTimes: data,
  };
};
