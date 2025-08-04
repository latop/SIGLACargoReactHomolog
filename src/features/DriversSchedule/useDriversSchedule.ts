import { useMemo } from "react";
import { useJourneysByPeriod } from "@/hooks/useJourneysByPeriod";
import { useSearchParams } from "next/navigation";
import { Circuit, Trip } from "@/interfaces/schedule";
import { useHash } from "@/hooks/useHash";

interface JourneySearchParams {
  startDate?: string;
  endDate?: string;
  nickName?: string;
  fleetGroupCode?: string;
  locationGroupCode?: string;
  positionCode?: string;
  nickNames?: string;
}

export function useDriverSchedule() {
  const params = useSearchParams();
  const searchParams: Partial<JourneySearchParams> = useMemo(() => {
    const tempSearchParams: Partial<JourneySearchParams> = {};
    const paramKeys: (keyof JourneySearchParams)[] = [
      "startDate",
      "endDate",
      "nickName",
      "fleetGroupCode",
      "locationGroupCode",
      "positionCode",
      "nickNames",
    ];

    paramKeys.forEach((key) => {
      const value = params.get(key);
      if (value !== null) {
        tempSearchParams[key] = value;
      }
    });

    return tempSearchParams;
  }, [params]);

  const { trips, circuits, drivers, updateTrip, updateCircuit } =
    useJourneysByPeriod();

  const hasRelevantParams = Object.keys(searchParams).length > 0;

  const handleUpdateTrip = ({
    tripId,
    newStartPlanned,
    newEndPlanned, // newDriverId,
  }: {
    tripId: string;
    newStartPlanned: string;
    newEndPlanned: string;
    // newDriverId: string;
  }) => {
    if (!trips || !drivers) return;

    const tripIndex = trips.findIndex((trip: Trip) => trip.id === tripId);
    const currentTrip = trips[tripIndex];
    const newTrip = {
      ...currentTrip,
      startPlanned: newStartPlanned,
      endPlanned: newEndPlanned,
      // driverId: newDriverId,
    };
    updateTrip(newTrip);
  };

  const handleUpdateCircuit = (newCircuit: Circuit) => {
    if (!circuits || !drivers) return;

    const circuitIndex = circuits.findIndex(
      (circuit: Circuit) => circuit.ciruictCode === newCircuit.ciruictCode,
    );
    const currentCircuit = circuits[circuitIndex];
    const circuit = {
      ...currentCircuit,
      ...newCircuit,
    };
    updateCircuit(circuit);
  };

  const [hash] = useHash();
  const matchJourney = (hash as string)?.match(/#journeyDetails-(.+)/);
  const tripDetailId = matchJourney?.[1];
  const matchActivity = (hash as string)?.match(/#activityDetails-(.+)/);
  const activityDetailId = matchActivity?.[1];

  return {
    showContent: hasRelevantParams,
    updatedTrip: handleUpdateTrip,
    updateCircuit: handleUpdateCircuit,
    tripDetailId,
    activityDetailId,
  };
}
