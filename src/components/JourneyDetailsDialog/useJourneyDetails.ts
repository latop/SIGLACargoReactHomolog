import { useCircuit } from "@/hooks/useCircuit";
import { useHash } from "@/hooks/useHash";
import { useJourneysByPeriod } from "@/hooks/useJourneysByPeriod";
import { useForm } from "react-hook-form";

export function useJourneyDetails() {
  const [hash] = useHash();
  const match = (hash as string)?.match(/#journeyDetails-(.+)/);
  const journeyDetailId = match?.[1];
  const methods = useForm({
    defaultValues: {
      circuitJourneyId: null,
      driverId: "",
      nickName: "",
      driverBase: "",
      driverSubBase: "",
      fleetCode: "",
      startDate: new Date(),
      endDate: new Date(),
      otmProcess: "",
      tasksDriver: [],
    },
  });
  const { circuits } = useJourneysByPeriod();
  const currentCircuit = circuits?.find(
    (circuit) => circuit.circuitCode === journeyDetailId,
  );

  const { circuit, isLoading } = useCircuit();

  return {
    data: circuit,
    isLoading: isLoading,
    journeyDetailId,
    currentCircuit,
    methods,
  };
}
