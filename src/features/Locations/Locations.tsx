"use client";

import React from "react";
import { MainContainer } from "@/components/MainContainer";
import { AppBar } from "@/components/AppBar";
import { HeaderTitle } from "@/components/HeaderTitle/HeaderTitle";
import { Box, Button, Card, CircularProgress } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridDeleteForeverIcon,
  // GridDeleteForeverIcon
} from "@mui/x-data-grid";
import { EmptyResult } from "@/components/EmptyResult";
import { ErrorResult } from "@/components/ErrorResult";
import { useLocations } from "./useLocations";
import { Locations as LocationsType } from "@/interfaces/trip";
import { LocationsFilterBar } from "@/components/LocationsFilterBar/LocaticationsFilterBar";
import { LocationsDialog } from "@/components/LocationsDialog";
import { useDialog } from "@/hooks/useDialog/useDialog";

export function Locations() {
  const { openDialog, closeDialog } = useDialog();
  const {
    locations,
    currentPage,
    loadMoreLines,
    totalCount,
    isLoading,
    isEmpty,
    hasData,
    isError,
    handleEditLocation,
    handleAddLocation,
    isToAddLocation,
    locationId,
    handleCloseDialog,
    handleDeleteLocation,
    isLoadingDelete,
    isFetchingNextPage,
  } = useLocations();

  const columns: GridColDef[] = [
    {
      field: "code",
      headerName: "Cód. Localidade",
      width: 150,
      sortable: false,
      filterable: false,
    },
    {
      field: "codeIntegration2",
      headerName: "Cód. TMS",
      width: 100,
      sortable: false,
      filterable: false,
    },
    {
      field: "codeIntegration1",
      headerName: "Cód. do GPS",
      width: 100,
      sortable: false,
      filterable: false,
    },
    {
      field: "name",
      headerName: "Nome da Localidade",
      width: 200,
      sortable: false,
      filterable: false,
    },
    {
      field: "locationGroup.code",
      headerName: "Grupo de Localização",
      width: 200,
      sortable: false,
      filterable: false,
      valueGetter: (_, data: LocationsType) => {
        return data.locationGroup?.code;
      },
    },
    {
      field: "locationType.code",
      headerName: "Tipo de Localização",
      width: 150,
      sortable: false,
      filterable: false,
      valueGetter: (_, data: LocationsType) => {
        return data.locationType.code;
      },
    },
    {
      field: "locationType.isOperation",
      headerName: "Local Operacional",
      width: 150,
      sortable: false,
      filterable: false,
      valueGetter: (_, data: LocationsType) => {
        return data.locationType.isOperation ? "Sim" : "Não";
      },
    },
    {
      field: " ",
      headerName: "Ação",
      sortable: false,
      filterable: false,
      width: 110,

      renderCell: (params) => {
        return (
          <button
            disabled={isLoadingDelete}
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
                  body: "Deseja apagar esta localização?",
                  onConfirm: async () => {
                    await handleDeleteLocation(params?.id as string).then(
                      () => {
                        closeDialog();
                      },
                    );
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
        <HeaderTitle>Localização</HeaderTitle>
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
        <LocationsFilterBar />
        <Button
          onClick={handleAddLocation}
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
            height: "634px",
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
                rows={locations || []}
                getRowId={(row) => row.id}
                loading={isFetchingNextPage}
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
                  handleEditLocation(params.id as string);
                }}
                initialState={{
                  pagination: {
                    paginationModel: { page: currentPage - 1, pageSize: 15 },
                  },
                }}
                onPaginationModelChange={() => {
                  loadMoreLines();
                }}
                pageSizeOptions={[15]}
                density="compact"
              />
            </div>
          )}
        </Card>
      </Box>
      <LocationsDialog open={!!locationId} onClose={handleCloseDialog} />
      <LocationsDialog open={!!isToAddLocation} onClose={handleCloseDialog} />
    </MainContainer>
  );
}
