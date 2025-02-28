"use client";

import React, { useState } from "react";
import { MainContainer } from "@/components/MainContainer";
import { AppBar } from "@/components/AppBar";
import { HeaderTitle } from "@/components/HeaderTitle/HeaderTitle";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, Button, Card, CircularProgress } from "@mui/material";
import { EmptyResult } from "@/components/EmptyResult";
import dayjs from "dayjs";
import { ErrorResult } from "@/components/ErrorResult";
import { useHash } from "@/hooks/useHash";
import { useScenarios } from "@/hooks/useScenarios";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { ScenarioDetailsDialog } from "@/components/ScenarioDetailsDialog";

const columns: GridColDef[] = [
  {
    field: "code",
    headerName: "Código",
    width: 200,
    sortable: false,
    filterable: false,
  },
  {
    field: "description",
    headerName: "Descrição",
    width: 550,
    sortable: false,
    filterable: false,
  },
  {
    field: "isDated",
    headerName: "Em vigência",
    width: 150,
    sortable: false,
    filterable: false,
    renderCell: (params) => {
      return params.value ? (
        <CheckIcon sx={{ marginTop: "15px" }} />
      ) : (
        <CloseIcon sx={{ marginTop: "15px" }} />
      );
    },
  },
  {
    field: "isDefault",
    headerName: "Padrão",
    width: 150,
    sortable: false,
    filterable: false,
    renderCell: (params) => {
      return params.value ? (
        <CheckIcon sx={{ marginTop: "15px" }} />
      ) : (
        <CloseIcon sx={{ marginTop: "15px" }} />
      );
    },
  },
  {
    field: "startDate",
    headerName: "Data de início",
    width: 150,
    sortable: false,
    filterable: false,
    valueFormatter: (value) => (value ? dayjs(value).format("DD/MM/YYYY") : ""),
  },
  {
    field: "endDate",
    headerName: "Data de fim",
    width: 150,
    sortable: false,
    filterable: false,
    valueFormatter: (value) => (value ? dayjs(value).format("DD/MM/YYYY") : ""),
  },
];

export function Scenarios() {
  const [showAddScenarioDialog, setShowAddScenarioDialog] = useState(false);
  const [hash, setHash] = useHash();
  const match = (hash as string)?.match(/#scenario-(.+)/);
  const scenarioId = match?.[1];
  const {
    scenarios,
    isLoading,
    hasData,
    isEmpty,
    size,
    error,
    totalCount,
    loadMore,
  } = useScenarios();

  const handleCloseDialog = () => {
    setHash("");
    setShowAddScenarioDialog(false);
  };

  const handleShowScenarioDialog = () => {
    setShowAddScenarioDialog(true);
  };

  return (
    <MainContainer>
      <AppBar>
        <HeaderTitle>Cenários</HeaderTitle>
      </AppBar>
      <Box
        sx={{
          width: "1400px",
          height: "100%",
          padding: "20px",
          gap: "20px",
          margin: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box display="flex" justifyContent="flex-end">
          <Button variant="contained" onClick={handleShowScenarioDialog}>
            Adicionar cenário
          </Button>
        </Box>
        <Card
          sx={{
            width: "100%",
            height: "calc(100% - 20px)",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {isLoading && (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              padding="10px"
              height="100%"
            >
              <CircularProgress />
            </Box>
          )}
          {isEmpty && <EmptyResult />}
          {error && <ErrorResult />}
          {hasData && (
            <div style={{ height: "100%", width: "100%" }}>
              <DataGrid
                rows={scenarios}
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
                  setHash(`#scenario-${params.row.id}`);
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
      </Box>
      <ScenarioDetailsDialog
        open={!!scenarioId || showAddScenarioDialog}
        onClose={handleCloseDialog}
      />
    </MainContainer>
  );
}
