"use client";

import { AppBar } from "@/components/AppBar";
import { HeaderTitle } from "@/components/HeaderTitle/HeaderTitle";
import { MainContainer } from "@/components/MainContainer";
import { ReportAccordion } from "@/components/ReportAccordion";
import { useReports } from "@/hooks/useReports";
import { Box, CircularProgress } from "@mui/material";

export function Reports() {
  const { data, isLoading } = useReports();
  return (
    <MainContainer>
      <AppBar style={{ display: "block" }}>
        <HeaderTitle>Relatórios</HeaderTitle>
      </AppBar>

      <Box
        sx={{
          width: "1400px",
          height: "100%",
          margin: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            width: "100%",
            alignSelf: "flex-start",
            padding: "10px 0",
          }}
        >
          <h1>Lista de relatórios</h1>
        </Box>

        {isLoading ? (
          <CircularProgress style={{ margin: "auto" }} />
        ) : (
          <ReportAccordion data={data} />
        )}
      </Box>
    </MainContainer>
  );
}
