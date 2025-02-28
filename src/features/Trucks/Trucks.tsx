"use client";

import React from "react";
import { MainContainer } from "@/components/MainContainer";
import { AppBar } from "@/components/AppBar";
import { HeaderTitle } from "@/components/HeaderTitle/HeaderTitle";
import { Box, Button, Card, CircularProgress } from "@mui/material";
import { useTrucks } from "./useTrucks";
import { TrucksFilterBar } from "@/components/TrucksFilterBar";
import { DataGrid, GridColDef, GridDeleteForeverIcon } from "@mui/x-data-grid";
import { EmptyResult } from "@/components/EmptyResult";
import { ErrorResult } from "@/components/ErrorResult";
import { Truck } from "@/interfaces/vehicle";
import { useDialog } from "@/hooks/useDialog/useDialog";
import { TrucksDialog } from "@/components/TrucksDialog";

export function Trucks() {
  const { openDialog, closeDialog } = useDialog();

  const {
    trucks,
    hasData,
    isEmpty,
    totalCount,
    currentPage,
    loadMoreLines,
    isLoading,
    isError,
    handleAddTruck,
    handleDeleteTruck,
    loadingDeleteTruck,
    addTruck,
    handleCloseDialog,
    handleEditTruck,
    truckId,
  } = useTrucks();

  const columns: GridColDef[] = [
    {
      field: "licensePlate",
      headerName: "Placa",
      width: 200,
      sortable: false,
      filterable: false,
    },
    {
      field: "fleetCode",
      headerName: "Cód. Frota",
      width: 200,
      sortable: false,
      filterable: false,
    },
    {
      field: "fleetType.code",
      headerName: "Tipo de frota",
      width: 200,
      sortable: false,
      filterable: false,
      valueGetter: (_, truck: Truck) => truck?.fleetType.code,
    },
    {
      field: "manufactureYear",
      headerName: "Ano Fabricação",
      width: 150,
      sortable: false,
      filterable: false,
    },
    // {
    //   field: "fleetType.fleetGroup.code",
    //   headerName: "Cód frota",
    //   width: 200,
    //   sortable: false,
    //   filterable: false,
    //   valueGetter: (_, truck: Truck) => truck?.fleetType.fleetGroup.code,
    // },
    {
      field: "locationGroup.code",
      headerName: "Base Operacional",
      width: 200,
      sortable: false,
      filterable: false,
      valueGetter: (_, truck: Truck) => truck?.locationGroup?.code,
    },
    {
      field: "",
      headerName: "Ação",
      sortable: false,
      filterable: false,
      width: 50,

      renderCell: (params) => {
        return (
          <button
            disabled={loadingDeleteTruck}
            style={{
              paddingTop: 12,
              display: "flex",
              gap: "8px",
              border: "none",
              background: "transparent",
            }}
          >
            <GridDeleteForeverIcon
              sx={{
                cursor: "pointer",
                color: "#e53935",
              }}
              onClick={() => {
                openDialog({
                  body: "Deseja apagar este caminhão?",
                  onConfirm: () => {
                    handleDeleteTruck({ truckId: params?.id as string });
                    closeDialog();
                  },
                  onCancel: () => {
                    closeDialog();
                  },
                });
              }}
            />
          </button>
        );
      },
    },
  ];

  return (
    <MainContainer>
      <AppBar>
        <HeaderTitle>Caminhão</HeaderTitle>
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
        <TrucksFilterBar />
        <Button
          onClick={handleAddTruck}
          variant="outlined"
          sx={{
            width: "170px",
            alignSelf: "flex-end",
          }}
        >
          Adicionar
        </Button>
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
          {isEmpty && !hasData && !isLoading && <EmptyResult />}
          {isError && !isLoading && <ErrorResult />}
          {hasData && !isEmpty && !isLoading && (
            <div style={{ height: "100%", width: "100%" }}>
              <DataGrid
                rows={trucks || []}
                getRowId={(row) => row.id}
                localeText={{
                  noRowsLabel: "Nenhum registro encontrado",
                  columnMenuHideColumn: "Ocultar coluna",
                  columnsManagementShowHideAllText: "Mostrar/Ocultar todas",
                  columnMenuManageColumns: "Gerenciar colunas",
                  MuiTablePagination: {
                    labelRowsPerPage: "Registros por página",
                    labelDisplayedRows: ({ from, to, count }) =>
                      // eslint-disable-next-line prettier/prettier
                      `${from}-${to} de ${count !== -1 ? count : `mais de ${to}`
                      }`,
                  },
                }}
                rowCount={totalCount}
                columns={columns}
                onRowDoubleClick={(params) => {
                  handleEditTruck(params.id as string);
                }}
                initialState={{
                  pagination: {
                    paginationModel: { page: currentPage - 1, pageSize: 10 },
                  },
                }}
                onPaginationModelChange={() => {
                  loadMoreLines();
                }}
                pageSizeOptions={[10]}
              />
            </div>
          )}
        </Card>
      </Box>
      <TrucksDialog open={!!addTruck} onClose={handleCloseDialog} />
      <TrucksDialog open={!!truckId} onClose={handleCloseDialog} />
    </MainContainer>
  );
}
