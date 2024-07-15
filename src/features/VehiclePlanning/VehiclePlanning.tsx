"use client";

import React, { useEffect } from "react";
import { MainContainer } from "@/components/MainContainer";
import { AppBar } from "@/components/AppBar";
import { HeaderTitle } from "@/components/HeaderTitle/HeaderTitle";
import { DataGrid, GridCellParams, GridColDef } from "@mui/x-data-grid";
import { Box, Button, Card, CircularProgress } from "@mui/material";
import { EmptyResult } from "@/components/EmptyResult";
import { useVehiclePlannings } from "@/hooks/useVehiclePlannings";
import dayjs from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";
import { ErrorResult } from "@/components/ErrorResult";
import { IVehiclePlanning } from "@/interfaces/vehicle";
import CheckIcon from "@mui/icons-material/Check";
import { useHash } from "@/hooks/useHash";
import { VehiclePlanningsFilterBar } from "@/components/VehiclePlanningsFilterBar";
import { VehiclePlanningDetailsDialog } from "@/components/VehiclePlanningDetailsDialog";

interface DayColumn {
  field: string;
  headerName: string;
}

const daysOfWeek: DayColumn[] = [
  { field: "freqMon", headerName: "Seg" },
  { field: "freqTue", headerName: "Ter" },
  { field: "freqWed", headerName: "Qua" },
  { field: "freqThu", headerName: "Qui" },
  { field: "freqFri", headerName: "Sex" },
  { field: "freqSat", headerName: "Sáb" },
  { field: "freqSun", headerName: "Dom" },
];

const generateDayColumns = (days: DayColumn[]) => {
  return days.map((day) => ({
    field: day.field,
    headerName: day.headerName,
    width: 50,
    sortable: false,
    filterable: false,
    renderCell: (params: GridCellParams) => {
      return params.value ? (
        <CheckIcon sx={{ marginTop: "15px" }} />
      ) : (
        <div>{""}</div>
      );
    },
  }));
};

const columns: GridColDef[] = [
  {
    field: "licensePlate",
    headerName: "Placa",
    width: 100,
    sortable: false,
    filterable: false,
    valueGetter: (_, data: IVehiclePlanning) => {
      return data.truck?.licensePlate;
    },
  },
  {
    field: "fleetCode",
    headerName: "Cód. Frota",
    width: 100,
    sortable: false,
    filterable: false,
    valueGetter: (_, data: IVehiclePlanning) => {
      return data.truck?.fleetCode;
    },
  },
  {
    field: "driver.nickName",
    headerName: "Motorista",
    width: 200,
    sortable: false,
    filterable: false,
    valueGetter: (_, data: IVehiclePlanning) => {
      return data.driver?.nickName;
    },
  },
  {
    field: "fleetType",
    headerName: "Gr. de frota",
    width: 100,
    sortable: false,
    filterable: false,
    valueGetter: (_, data: IVehiclePlanning) => {
      return data.truck?.fleetType.code;
    },
  },
  {
    field: "base",
    headerName: "Base do veículo",
    width: 150,
    sortable: false,
    filterable: false,
  },
  {
    field: "startTime",
    headerName: "Início",
    width: 170,
    sortable: false,
    filterable: false,
    valueFormatter: (value) =>
      value ? dayjs(value).format("DD/MM/YYYY HH:mm") : "N/A",
  },
  {
    field: "endTime",
    headerName: "Fim",
    width: 170,
    sortable: false,
    filterable: false,
    valueFormatter: (value) =>
      value ? dayjs(value).format("DD/MM/YYYY HH:mm") : "N/A",
  },
  ...generateDayColumns(daysOfWeek),
];

export function VehiclePlanning() {
  const [hash, setHash] = useHash();
  const isOpen = hash.includes("vehiclePlanning");
  const params = useSearchParams();
  const router = useRouter();
  const {
    vehiclePlannings,
    isLoading,
    hasData,
    isEmpty,
    size,
    error,
    totalCount,
    loadMore,
  } = useVehiclePlannings();

  const showContent = params.get("tripDate");

  const handleCloseDialog = () => {
    setHash("");
  };

  useEffect(() => {
    if (!params.get("tripDate")) {
      const newParams = new URLSearchParams();
      newParams.append("tripDate", dayjs().format("YYYY-MM-DD"));
      router.push(`/vehicle-planning?${newParams.toString()}`);
    }
  }, [params]);

  const handleAddTravel = () => {
    setHash("#vehiclePlanning");
  };

  return (
    <MainContainer>
      <AppBar>
        <HeaderTitle>Planejamento de veículos</HeaderTitle>
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
        <VehiclePlanningsFilterBar />
        <Box display="flex" justifyContent="flex-end" mt="25px" mb="10px">
          <Button variant="outlined" size="small" onClick={handleAddTravel}>
            Adicionar viagem
          </Button>
        </Box>
        {showContent && (
          <Card
            sx={{
              width: "100%",
              height: "635px",
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
                  rows={vehiclePlannings}
                  localeText={{
                    noRowsLabel: "Nenhum registro encontrado",
                    columnMenuHideColumn: "Ocultar coluna",
                    columnsManagementShowHideAllText: "Mostrar/Ocultar todas",
                    columnMenuManageColumns: "Gerenciar colunas",
                    MuiTablePagination: {
                      labelRowsPerPage: "Registros por página",
                      labelDisplayedRows: ({ from, to, count }) =>
                        `${from}-${to} de ${
                          count !== -1 ? count : `mais de ${to}`
                        }`,
                    },
                  }}
                  columns={columns}
                  onCellDoubleClick={(params) => {
                    setHash(`#vehiclePlanning-${params.row.id}`);
                  }}
                  initialState={{
                    pagination: {
                      paginationModel: { page: size - 1, pageSize: 10 },
                    },
                  }}
                  onPaginationModelChange={(params) => {
                    loadMore(params.page + 1);
                  }}
                  rowCount={totalCount}
                  pageSizeOptions={[10]}
                />
              </div>
            )}
          </Card>
        )}
      </Box>
      <VehiclePlanningDetailsDialog
        open={!!isOpen}
        onClose={handleCloseDialog}
      />
    </MainContainer>
  );
}
