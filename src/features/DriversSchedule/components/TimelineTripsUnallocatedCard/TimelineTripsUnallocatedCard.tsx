"use client";

import React from "react";
import { Waypoint } from "react-waypoint";
import { useTimelineTripsUnallocatedCard } from "./useTimelineTripsUnallocatedCard";
import { Card, CircularProgress, Box } from "@mui/material";
import { EmptyResult } from "@/components/EmptyResult";
import { TimelineTripsUnallocated } from "@/components/TimelineTripsUnallocated";

export function TimelineTripsUnallocatedCard() {
  const { isEmpty, isLoadingMore, isReachingEnd, isLoading, loadMore } =
    useTimelineTripsUnallocatedCard();

  return (
    <Card
      sx={{
        height: "100%",
        overflow: "auto",
        position: "relative",
      }}
    >
      {isLoading && (
        <CircularProgress
          sx={{
            margin: "auto",
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
          }}
        />
      )}
      {isEmpty && <EmptyResult />}
      {!isEmpty && !isLoading && <TimelineTripsUnallocated />}
      {!isReachingEnd && <Waypoint onEnter={loadMore} bottomOffset={-250} />}
      {isLoadingMore && (
        <Box display="flex" justifyContent="center" mt={2} marginBottom={2}>
          <CircularProgress />
        </Box>
      )}
    </Card>
  );
}
