import { useJourneysByPeriod } from "@/hooks/useJourneysByPeriod";

export function useTimelineTripsCard() {
  const { drivers, hasNext, isLoading, setSize, isValidating } =
    useJourneysByPeriod();

  const isEmpty = !isLoading && drivers && drivers?.length <= 0;

  const isLoadingMore = isValidating;

  const isReachingEnd = !hasNext && !isEmpty;

  const loadMoreDrivers = () => {
    if (hasNext && !isLoadingMore) {
      setSize((prevSize) => prevSize + 1);
    }
  };

  return {
    isLoading,
    isEmpty,
    isLoadingMore: isLoadingMore && !isLoading,
    isReachingEnd,
    loadMoreDrivers,
  };
}
