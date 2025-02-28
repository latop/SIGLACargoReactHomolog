"use client";

import React from "react";
import { Waypoint } from "react-waypoint";
import { useTimelineDailyTripCard } from "./useTimelineDailyTripCard";
import { Card, Box, CircularProgress } from "@mui/material";
import { EmptyResult } from "@/components/EmptyResult";
import { TimelineDailyTrips } from "@/components/TimelineDailyTrips";

export function TimelineDailyTripCard() {
  const { isEmpty, isLoadingMore, isReachingEnd, isLoading, loadMore } =
    useTimelineDailyTripCard();

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
      {!isEmpty && !isLoading && <TimelineDailyTrips />}
      {!isReachingEnd && <Waypoint onEnter={loadMore} bottomOffset={-100} />}
      {isLoadingMore && (
        <Box display="flex" justifyContent="center" mt={2} marginBottom={2}>
          <CircularProgress />
        </Box>
      )}
    </Card>
  );
}
