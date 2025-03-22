"use client";

import React from "react";
import { MainContainer } from "@/components/MainContainer";
import { AppBar } from "@/components/AppBar";
import { HeaderTitle } from "@/components/HeaderTitle/HeaderTitle";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, Button, Card, CircularProgress } from "@mui/material";
import { EmptyResult } from "@/components/EmptyResult";
import { ErrorResult } from "@/components/ErrorResult";
import { DailyTrip } from "@/interfaces/daily-trip";
import { useHash } from "@/hooks/useHash";
import { useLines } from "@/hooks/useLines";
import { LinesFilterBar } from "@/components/LinesFilterBar";
import { AddLineDialog } from "@/components/AddLineDialog";
import { UpdateLineDialog } from "@/components/UpdateLineDialog";

import { useLine } from "@/hooks/useLine";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useDialog } from "@/hooks/useDialog/useDialog";

export function Lines() {
  const [hash, setHash] = useHash();
  const isToAddLine = hash.includes("add-line");
  const isLineOpen = hash.includes("#line-id-");
  const { openDialog, closeDialog } = useDialog();

  const {
    lines,
    loadMoreLines,
    size,
    isLoading,
    isEmpty,
    error,
    totalCount,
    hasData,
    refetchLines,
    isLoadingMore,
  } = useLines();
  const { handleDeleteLine } = useLine();

  const columns: GridColDef[] = [
    {
      field: "line.code",
      headerName: "Cód. da Rota",
      width: 400,
      sortable: false,
      filterable: false,
      valueGetter: (_, data: DailyTrip) => {
        return data.line ? data?.line?.code : "";
      },
    },
    {
      field: "locationOrig.code",
      headerName: "Origem/Destino",
      width: 200,
      sortable: false,
      filterable: false,
      valueGetter: (_, data) => {
        return data.line.locationOrig && !!data.line.locationDest
          ? `${data?.line?.locationOrig?.code} / ${data?.line?.locationDest?.code}`
          : "";
      },
    },
    {
      field: "tripType.description",
      headerName: "Tipo de Viagem",
      width: 300,
      sortable: false,
      filterable: false,
      valueGetter: (_, data) => {
        return data?.line?.tripType?.description
          ? `${data?.line?.tripType?.description}`
          : "N/A";
      },
    },
    {
      field: "fleetGroup.code",
      headerName: "Cód. Da Frota",
      width: 200,
      sortable: false,
      filterable: false,
      valueGetter: (_, data) => {
        return data?.line?.fleetGroup?.code
          ? `${data?.line?.fleetGroup?.code}`
          : "N/A";
      },
    },
    {
      field: "qtdLineSections",
      headerName: "Seções",
      width: 100,
      sortable: false,
      filterable: false,
    },
    {
      field: " ",
      headerName: "",
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        return (
          <span
            style={{
              paddingTop: 12,
              display: "flex",
              gap: "8px",
            }}
          >
            <DeleteForeverIcon
              sx={{
                cursor: "pointer",
                color: "#e53935",
              }}
              onClick={() => {
                openDialog({
                  body: "Deseja apagar esta rota?",
                  onConfirm: () => {
                    handleDeleteLine(params?.id as string, refetchLines);
                    closeDialog();
                  },
                  onCancel: () => {
                    closeDialog();
                  },
                });
              }}
            />
          </span>
        );
      },
    },
  ];

  const handleCloseDialog = () => {
    setHash("");
  };
  const handleAddLine = () => {
    setHash("add-line");
  };

  return (
    <MainContainer>
      <AppBar>
        <HeaderTitle>Rotas</HeaderTitle>
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
        <LinesFilterBar />
        <Box display="flex" justifyContent="flex-end" mt="25px" mb="10px">
          <Button
            variant="outlined"
            sx={{ maxWidth: "200px", alignSelf: "flex-end", width: "170px" }}
            onClick={handleAddLine}
            disabled={isLoading}
          >
            Adicionar rotas
          </Button>
        </Box>
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
                rows={lines}
                getRowId={(row) => row.line.id}
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
                loading={isLoadingMore}
                rowCount={totalCount}
                columns={columns}
                onCellDoubleClick={(params) => {
                  setHash(`#line-id-${params.row.line.id}`);
                }}
                initialState={{
                  pagination: {
                    paginationModel: { page: size - 1, pageSize: 15 },
                  },
                }}
                onPaginationModelChange={(params) => {
                  loadMoreLines(params.page + 1);
                }}
                pageSizeOptions={[15]}
                density="compact"
              />
            </div>
          )}
        </Card>
      </Box>
      <AddLineDialog open={!!isToAddLine} onClose={handleCloseDialog} />
      <UpdateLineDialog open={!!isLineOpen} onClose={handleCloseDialog} />
    </MainContainer>
  );
}
