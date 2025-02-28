"use client";

import React from "react";
import { MainContainer } from "@/components/MainContainer";
import { AppBar } from "@/components/AppBar";
import { HeaderTitle } from "@/components/HeaderTitle/HeaderTitle";
import { Box } from "@mui/material";
import { PublishJourneyFilterBar } from "@/components/PublishJourneyFilterBar";

export function PublishJourney() {
  return (
    <MainContainer>
      <AppBar>
        <HeaderTitle>Publicação</HeaderTitle>
      </AppBar>
      <Box
        sx={{
          width: "1400px",
          height: "calc(100% - 64px)",
          padding: "20px",
          margin: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <PublishJourneyFilterBar />
      </Box>
    </MainContainer>
  );
}
