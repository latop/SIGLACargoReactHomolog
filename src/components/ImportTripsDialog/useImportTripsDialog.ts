"use client";

import { useHash } from "@/hooks/useHash";
import { fetchGtmById } from "@/services/import-trips";
import React from "react";
import useSWR from "swr";

export const useImportTripsDialog = () => {
  const [hash] = useHash();
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [isPinned, setIsPinned] = React.useState(true);
  const importedTripId = (hash as string)?.match(/#importedTripId-(.+)/)?.[1];

  const getKey = () => {
    if (importedTripId) {
      return {
        url: `/trips/${importedTripId}`,
        id: importedTripId,
      };
    }
    return null;
  };
  const {
    data: importedTrip,
    isLoading,
    isValidating,
  } = useSWR(getKey, fetchGtmById, {
    revalidateOnFocus: false,
    revalidateOnMount: true,
  });
  const tripGTMS = importedTrip?.tripGTMS;
  const tripGTMSDetails = importedTrip?.tripGTMSDetails;

  return {
    tripGTMS,
    tripGTMSDetails,
    importedTripId,
    isLoading: isLoading || isValidating,
    isFullscreen,
    setIsFullscreen,
    isPinned,
    setIsPinned,
  };
};
