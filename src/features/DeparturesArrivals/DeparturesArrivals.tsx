"use client";

import React from "react";
import { MainContainer } from "@/components/MainContainer";
import { AppBar } from "@/components/AppBar";
import { HeaderTitle } from "@/components/HeaderTitle/HeaderTitle";
import { DeparturesArrivalsFilterBar } from "@/components/DeparturesArrivalsFilterBar";
import { useDeparturesArrivals } from "@/hooks/useDeparturesArrivals";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, Card, CircularProgress } from "@mui/material";
import { EmptyResult } from "@/components/EmptyResult";

const columns: GridColDef[] = [
  { field: "sto", headerName: "Sto", width: 200 },
  { field: "locCode", headerName: "Cód. Localização", width: 200 },
  { field: "timePlanned", headerName: "Tempo planejado", width: 200 },
  { field: "timeEstimated", headerName: "Tempo estimado", width: 200 },
  { field: "statusTrip", headerName: "Status", width: 150 },
  // { field: "truckFleetCode", headerName: "Cód. frota", width: 180 },
  // { field: "nickName", headerName: "Nome", width: 150 },
  { field: "direction", headerName: "Direção", width: 100 },
];

export function DeparturesArrivals() {
  const { departuresArrivals, isLoading, showContent, isEmpty } =
    useDeparturesArrivals();

  return (
    <MainContainer>
      <AppBar>
        <HeaderTitle>Partidas e chegadas</HeaderTitle>
      </AppBar>
      <DeparturesArrivalsFilterBar />
      {showContent && (
        <Box sx={{ height: "100%", overflow: "hidden" }}>
          <Card
            sx={{
              width: "1080px",
              height: "calc(100% - 30px)",
              margin: "10px auto 20px",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isLoading && <CircularProgress />}
            {isEmpty && <EmptyResult />}
            {!isEmpty && !isLoading && (
              <div style={{ height: "100%", width: "100%" }}>
                <DataGrid
                  rows={departuresArrivals}
                  columns={columns}
                  initialState={{
                    pagination: {
                      paginationModel: { page: 0, pageSize: 100 },
                    },
                  }}
                  pageSizeOptions={[100]}
                />
              </div>
            )}
          </Card>
        </Box>
      )}
    </MainContainer>
  );
}
