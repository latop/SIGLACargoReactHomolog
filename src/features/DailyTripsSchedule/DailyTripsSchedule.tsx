"use client";

import React from "react";
import { MainContainer } from "@/components/MainContainer";
import { AppBar } from "@/components/AppBar";
import { GianttTable } from "@/components/GianttTable";
import { HeaderTitle } from "@/components/HeaderTitle/HeaderTitle";
import { GianttZoom } from "@/components/GianttZoom";
import { Old_DailyTripDetailsDialog } from "@/components/Old_DailyTripDetailsDialog";
import { GianttProvider } from "@/hooks/useGiantt";
import { useDailyTripsSchedule } from "./useDailyTripsSchedule";
import { Box, Button } from "@mui/material";
import { TimelineDailyTripCard } from "./components/TimelineDailyTripCard";
import { DailyTripsByPeriodFilterBar } from "@/components/DailyTripsByPeriodFilterBar";
import { useHash } from "@/hooks/useHash";
import { useSearchParams } from "next/navigation";
import { TruckAssignmentDialog } from "@/components/TruckAssingmentDialog";
import AddIcon from "@mui/icons-material/Add";
import { NewTruckAssingmentFormDialog } from "./components/NewTruckAssignmentFormDialog";

export function DailyTripsSchedule() {
  const params = useSearchParams();
  const { showContent } = useDailyTripsSchedule();
  const [hash, setHash] = useHash();
  const match = (hash as string)?.match(/#dailyTrip-(.+)/);
  const dailyTripId = match?.[1];

  const hasShowTruckAssignment = params.get("showTruckAssignment") === "true";

  const isDailyTripDialogOpen = !hasShowTruckAssignment && !!dailyTripId;
  const isTruckAssignmentDialogOpen = hasShowTruckAssignment && !!dailyTripId;

  const handleCloseDialog = () => {
    setHash("");
  };

  return (
    <MainContainer>
      <AppBar>
        <HeaderTitle>Coordenação de viagens</HeaderTitle>
      </AppBar>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        padding="20px 20px 0"
      >
        <DailyTripsByPeriodFilterBar />
        {hasShowTruckAssignment && (
          <Button
            variant="outlined"
            onClick={() => setHash("#isNewAssignment")}
          >
            Adicionar atribuição
            <AddIcon fontSize="small" />
          </Button>
        )}
      </Box>

      {showContent && (
        <MainContainer.Content sx={{ overflow: "hidden" }}>
          <GianttProvider>
            <GianttTable>
              <Box
                width="100%"
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                }}
              >
                <Box
                  display="flex"
                  gap="10px"
                  marginTop="20px"
                  alignItems="center"
                >
                  <GianttZoom />
                </Box>
              </Box>
              <Box sx={{ height: "calc(100% - 40px)", width: "100%" }}>
                <Box
                  sx={{
                    height: `calc(100% - 40px)`,
                  }}
                >
                  <TimelineDailyTripCard />
                </Box>
              </Box>
            </GianttTable>
          </GianttProvider>
        </MainContainer.Content>
      )}

      <Old_DailyTripDetailsDialog
        open={isDailyTripDialogOpen}
        onClose={handleCloseDialog}
      />
      <TruckAssignmentDialog
        isOpen={isTruckAssignmentDialogOpen}
        onClose={handleCloseDialog}
      />
      <NewTruckAssingmentFormDialog
        isOpen={hash === "#isNewAssignment"}
        onClose={handleCloseDialog}
      />
    </MainContainer>
  );
}
