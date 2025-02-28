"use client";

import React from "react";
import { TimelineTrips } from "@/components/TimelineTrips";
import { Waypoint } from "react-waypoint";
import { useTimelineTripsCard } from "./useTimelineTripsCard";
import { Card, Box, CircularProgress } from "@mui/material";
import { EmptyResult } from "@/components/EmptyResult";

export function TimelineTripsCard() {
  const { isEmpty, isLoadingMore, isReachingEnd, isLoading, loadMoreDrivers } =
    useTimelineTripsCard();

  return (
    <Card
      sx={{
        marginTop: "10px",
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "auto",
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
      {!isEmpty && !isLoading && <TimelineTrips />}
      {!isReachingEnd && (
        <Waypoint onEnter={loadMoreDrivers} bottomOffset={-100} />
      )}
      {isLoadingMore && (
        <Box display="flex" justifyContent="center" mt={2} marginBottom={2}>
          <CircularProgress />
        </Box>
      )}
    </Card>
  );
}
