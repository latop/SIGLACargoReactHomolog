/* eslint-disable prettier/prettier */
"use client";

import React, { useEffect } from "react";
import { MainContainer } from "@/components/MainContainer";
import { AppBar } from "@/components/AppBar";
import { HeaderTitle } from "@/components/HeaderTitle/HeaderTitle";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, Button, Card, CircularProgress } from "@mui/material";
import { EmptyResult } from "@/components/EmptyResult";
import { useDailyTrips } from "@/hooks/useDailyTrips";
import { DailyTripsFilterBar } from "@/components/DailyTripsFilterBar";
import dayjs from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";
import { ErrorResult } from "@/components/ErrorResult";
import { DailyTrip } from "@/interfaces/daily-trip";
import { DailyTripDetailsDialog } from "@/components/DailyTripDetailsDialog";
import { useHash } from "@/hooks/useHash";
import { GenerateDailyTripDialog } from "@/components/GenerateDailyTripDialog";
import { formatPlate } from "@/utils";

const columns: GridColDef[] = [
  {
    field: "tripDate",
    headerName: "Data da viagem",
    width: 150,
    sortable: false,
    filterable: false,
    valueFormatter: (value) =>
      value ? dayjs(value).format("DD/MM/YYYY") : "",
  },
  {
    field: "sto",
    headerName: "Sto",
    width: 200,
    sortable: false,
    filterable: false,
  },
  {
    field: "flgStatus",
    headerName: "Status",
    width: 100,
    sortable: false,
    filterable: false,
    valueFormatter: (value) =>
      value === 'C' ? 'CANCELADO' : "NORMAL",
  },
  {
    field: "endPlanned",
    headerName: "Chegada Prevista",
    width: 150,
    sortable: false,
    filterable: false,
    valueFormatter: (value) =>
      value ? dayjs(value).format("DD/MM/YYYY HH:mm") : "",
  },
  {
    field: "startPlanned",
    headerName: "Saída Prevista",
    width: 150,
    sortable: false,
    filterable: false,
    valueFormatter: (value) =>
      value ? dayjs(value).format("DD/MM/YYYY HH:mm") : "",
  },

  {
    field: "locationOrig.code",
    headerName: "Origem",
    width: 150,
    sortable: false,
    filterable: false,
    valueGetter: (_, data: DailyTrip) => {
      return data.locationOrig ? data.locationOrig.code : "";
    },
  },
  {
    field: "locationDest.code",
    headerName: "Destino",
    width: 150,
    sortable: false,
    filterable: false,
    valueGetter: (_, data: DailyTrip) => {
      return data.locationDest ? data.locationDest.code : "";
    },
  },
  {
    field: "tripType.code",
    headerName: "Tipo de viagem",
    width: 200,
    sortable: false,
    filterable: false,
    valueGetter: (_, data: DailyTrip) => {
      return data.tripType ? data.tripType.code : "";
    },
  },
  {
    field: "licensePlateTrailer",
    headerName: "Placa",
    width: 200,
    sortable: false,
    filterable: false,
    valueGetter: (value) => {
      return formatPlate(value)
    },
  },

  // {
  //   field: "lineCode",
  //   headerName: "Cód. Linha",
  //   width: 200,
  //   sortable: false,
  //   filterable: false,
  //   valueGetter: (_, data: DailyTrip) => {
  //     return data.line ? data.line.code : "";
  //   },
  // },

  // {
  //   field: "fleetGroup.code",
  //   headerName: "Cód frota",
  //   width: 200,
  //   sortable: false,
  //   filterable: false,
  //   valueGetter: (_, data: DailyTrip) => {
  //     return data.fleetGroup ? data.fleetGroup.code : "";
  //   },
  // },



];

export function DailyTrips() {
  const [hash, setHash] = useHash();
  const isOpen = hash.includes("dailyTrip");
  const isGenerateDialogOpen = hash.includes("generateTrip")
  const params = useSearchParams();
  const router = useRouter();
  const {
    dailyTrips,
    isLoading,
    hasData,
    isEmpty,
    size,
    error,
    totalCount,
    loadMoreDailyTrips,
  } = useDailyTrips();

  const showContent = params.get("tripDate");

  const handleCloseDialog = () => {
    setHash("");
  };

  useEffect(() => {
    if (!params.get("tripDate")) {
      const newParams = new URLSearchParams();
      newParams.append("tripDate", dayjs().format("YYYY-MM-DD"));
      router.push(`/daily-trips?${newParams.toString()}`);
    }
  }, [params]);

  const handleAddTravel = () => {
    setHash("#dailyTrip");
  };


  const handleOpenGenerateTripDialog = () => {
    setHash("#generateTrip");
  }


  return (
    <MainContainer>
      <AppBar>
        <HeaderTitle>Viagens diárias</HeaderTitle>
      </AppBar>
      <Box
        sx={{
          width: "1400px",
          height: "100%",
          padding: "20px",
          margin: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <DailyTripsFilterBar />
        <Box
          display="flex"
          justifyContent="flex-end"
          mt="25px"
          mb="10px"
          gap={1}
        >
          <Button variant="outlined" size="small" onClick={handleOpenGenerateTripDialog}>
            Gerar viagem diária
          </Button>
          <Button variant="outlined" size="small" onClick={handleAddTravel}>
            Adicionar viagem
          </Button>
        </Box>
        {showContent && (
          <Card
            sx={{
              width: "100%",
              height: "634px",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isLoading && <CircularProgress />}
            {isEmpty && <EmptyResult />}
            {error && <ErrorResult />}
            {hasData && (
              <div style={{ height: "100%", width: "100%" }}>
                <DataGrid
                  rows={dailyTrips}
                  localeText={{
                    noRowsLabel: "Nenhum registro encontrado",
                    columnMenuHideColumn: "Ocultar coluna",
                    columnsManagementShowHideAllText: "Mostrar/Ocultar todas",
                    columnMenuManageColumns: "Gerenciar colunas",
                    MuiTablePagination: {
                      labelRowsPerPage: "Registros por página",
                      labelDisplayedRows: ({ from, to, count }) =>
                        `${from}-${to} de ${count !== -1 ? count : `mais de ${to}`
                        }`,
                    },
                  }}
                  columns={columns}
                  onCellDoubleClick={(params) => {
                    setHash(`#dailyTrip-${params.row.id}`);
                  }}
                  initialState={{
                    pagination: {
                      paginationModel: { page: size - 1, pageSize: 10 },
                    },
                  }}
                  onPaginationModelChange={(params) => {
                    loadMoreDailyTrips(params.page + 1);
                  }}
                  rowCount={totalCount}
                  pageSizeOptions={[10]}
                />
              </div>
            )}
          </Card>
        )}
      </Box>
      <DailyTripDetailsDialog open={!!isOpen} onClose={handleCloseDialog} />
      <GenerateDailyTripDialog isOpen={isGenerateDialogOpen} onClose={handleCloseDialog} />
    </MainContainer>
  );
}
