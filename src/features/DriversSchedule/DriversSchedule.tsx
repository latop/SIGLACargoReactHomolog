"use client";

import React from "react";
import { MainContainer } from "@/components/MainContainer";
import { AppBar } from "@/components/AppBar";
import AspectRatioIcon from "@mui/icons-material/AspectRatio";
import { GianttTable } from "@/components/GianttTable";
import { HeaderTitle } from "@/components/HeaderTitle/HeaderTitle";
import theme from "@/styles/theme";
import { JourneyFilterBar } from "@/components/JourneyFilterBar";
import { GianttZoom } from "@/components/GianttZoom";
import { GianttProvider } from "@/hooks/useGiantt";
import { useDriverSchedule } from "./useDriversSchedule";
import { JourneyDetailsDialog } from "@/components/JourneyDetailsDialog";
import { useHash } from "@/hooks/useHash";
import {
  Box,
  Button,
  IconButton,
  Typography,
  Icon,
  TextField,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { TimelineTripsCard } from "./components/TimelineTripsCard";
import { TimelineTripsUnallocatedCard } from "./components/TimelineTripsUnallocatedCard";
import { ActivityDialog } from "@/components/ActivityDialog";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export function DriversSchedule() {
  const [expanded, setExpanded] = React.useState(false);
  const [showSelectedView, setShowSelectedView] = useLocalStorage(
    "showSelectedView",
    "2",
  );
  const [showActivityDialog, setShowActivityDialog] = React.useState(false);
  const [showJourneyDialog, setShowJourneyDialog] = React.useState(false);

  const handleOpenJourneyDialog = () => {
    setShowJourneyDialog(true);
  };

  const handleCloseJourneyDialog = () => {
    setShowJourneyDialog(false);
  };

  // const handleOpenActivityDialog = () => {
  //   setShowActivityDialog(true);
  // };

  const handleCloseActivityDialog = () => {
    setShowActivityDialog(false);
    setHash("");
  };

  const [, setHash] = useHash();
  const { showContent, tripDetailId, activityDetailId } = useDriverSchedule();

  const handleCloseTripDetails = () => {
    handleCloseJourneyDialog();
    setHash("");
  };

  const toggleExpanded = () => {
    setExpanded((prev: boolean) => !prev);
  };

  const handleSelectView = (value: string) => {
    setShowSelectedView(value);
  };

  const showAll = showSelectedView === "1";
  const showAllocated = showSelectedView === "2" || showAll;
  const showUnallocated = showSelectedView === "3" || showAll;
  return (
    <MainContainer>
      <AppBar style={{ display: expanded ? "none" : "block" }}>
        <HeaderTitle>Escala de Motoristas</HeaderTitle>
      </AppBar>
      <JourneyFilterBar style={{ display: expanded ? "none" : "block" }} />
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
                  <TextField
                    variant="outlined"
                    fullWidth
                    onChange={(e) => handleSelectView(e.target.value)}
                    value={showSelectedView}
                    select
                    size="small"
                  >
                    <MenuItem value="1">Mostrar tudo</MenuItem>
                    <MenuItem value="2">Mostrar viagens alocadas</MenuItem>
                    <MenuItem value="3">Mostrar viagens não alocadas</MenuItem>
                  </TextField>
                  <IconButton
                    sx={{ padding: 0 }}
                    onClick={toggleExpanded}
                    aria-label="expandir tabela de motoristas"
                  >
                    <AspectRatioIcon />
                  </IconButton>
                </Box>
                <Box display="flex" gap="10px">
                  <Button
                    variant="outlined"
                    onClick={handleOpenJourneyDialog}
                    color="primary"
                    size="medium"
                  >
                    <Icon component={AddIcon} fontSize="small" />
                    <Typography
                      variant="body2"
                      ml="5px"
                      color={theme.palette.primary.main}
                    >
                      Circuito
                    </Typography>
                  </Button>
                </Box>
              </Box>
              <Box sx={{ height: "calc(100% - 60px)", width: "100%" }}>
                {showAllocated && (
                  <Box
                    sx={{
                      height: `calc(${showAll ? "75%" : "100%"} - 40px)`,
                    }}
                  >
                    <TimelineTripsCard key="TimelineTripsCard" />
                  </Box>
                )}
                {showUnallocated && (
                  <Box
                    sx={{
                      height: !showAll
                        ? "calc(100% - 50px)"
                        : "calc(25% - 15px)",
                    }}
                    mt="20px"
                  >
                    <TimelineTripsUnallocatedCard key="TimelineTripsUnallocatedCard" />
                  </Box>
                )}
              </Box>
            </GianttTable>
          </GianttProvider>
        </MainContainer.Content>
      )}
      {(tripDetailId || showJourneyDialog) && (
        <JourneyDetailsDialog open onClose={handleCloseTripDetails} />
      )}
      {(showActivityDialog || activityDetailId) && (
        <ActivityDialog open onClose={handleCloseActivityDialog} />
      )}
    </MainContainer>
  );
}
