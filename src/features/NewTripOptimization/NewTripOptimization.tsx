"use client";

import { AppBar } from "@/components/AppBar";
import { HeaderTitle } from "@/components/HeaderTitle/HeaderTitle";
import { MainContainer } from "@/components/MainContainer";
import { NewTripOptmizationFilterBar } from "@/components/NewTripOptimizationFilterBar";
import { Box, Card } from "@mui/material";

import { useNewTripOptimization } from "./useNewTripOptmization";
import { OptimizeAccordionTable } from "./components/OptmizeAccordionTable";
import { AccordionSkeleton } from "@/components/AccordionSkeleton";

export function NewTripOptimization() {
  const { optimizationData, isLoading } = useNewTripOptimization();

  return (
    <MainContainer>
      <AppBar style={{ display: "block" }}>
        <HeaderTitle>Nova Otimização de viagens</HeaderTitle>
      </AppBar>
      <Box
        sx={{
          width: "1400px",
          height: "calc(100% - 64px)",
          padding: "20px",
          margin: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <NewTripOptmizationFilterBar />
        <Card
          sx={{
            width: "100%",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            overflow: "scroll",
          }}
        >
          {isLoading ? (
            <AccordionSkeleton count={8} />
          ) : (
            optimizationData?.map((optimization, index) => (
              <OptimizeAccordionTable
                key={optimization.description}
                optimization={optimization}
                index={index}
              />
            ))
          )}
        </Card>
      </Box>
    </MainContainer>
  );
}
