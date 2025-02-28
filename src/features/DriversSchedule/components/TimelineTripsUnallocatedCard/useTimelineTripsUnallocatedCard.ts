import { useDailyTripsUnallocated } from "@/hooks/useDailyTripsUnallocated";

export function useTimelineTripsUnallocatedCard() {
  const {
    dailyTripsUnallocated,
    isLoading,
    hasNext,
    setSize: setSize,
    isValidating,
  } = useDailyTripsUnallocated();

  const isEmpty =
    !isLoading && dailyTripsUnallocated && dailyTripsUnallocated?.length <= 0;

  const isLoadingMore = isValidating;

  const isReachingEnd = !hasNext && !isEmpty;

  const loadMore = () => {
    if (hasNext && !isLoadingMore) {
      setSize((prevSize) => prevSize + 1);
    }
  };

  return {
    dailyTripsUnallocated,
    isLoading,
    loadMore,
    isLoadingMore: isLoadingMore && !isLoading,
    isEmpty,
    isReachingEnd,
  };
}
