import { useDailyTripsByPeriod } from "@/hooks/useDailyTripsByPeriod";

export function useTimelineDailyTripCard() {
  const { trucks, hasNext, isLoading, setSize, isValidating } =
    useDailyTripsByPeriod();

  const isEmpty = !isLoading && trucks && trucks?.length <= 0;

  const isLoadingMore = isValidating;

  const isReachingEnd = !hasNext && !isEmpty;

  const loadMore = () => {
    if (hasNext && !isLoadingMore) {
      setSize((prevSize) => prevSize + 1);
    }
  };

  return {
    isLoading,
    isEmpty,
    isLoadingMore: isLoadingMore && !isLoading,
    isReachingEnd,
    loadMore,
  };
}
