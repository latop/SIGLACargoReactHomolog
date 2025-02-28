import { Trip } from "@/interfaces/schedule";
import { useJourneysByPeriod } from "@/hooks/useJourneysByPeriod";
import { useHash } from "@/hooks/useHash";

export function useActivityDialog() {
  const { trips } = useJourneysByPeriod();
  const [hash] = useHash();
  const match = (hash as string)?.match(/#activityDetails-(.+)/);
  const activityDetailId = match?.[1];
  const currentTrip = trips.find((trip: Trip) => trip.id === activityDetailId);

  return {
    activityDetailId,
    currentTrip,
  };
}
