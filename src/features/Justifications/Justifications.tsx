"use client";

import React from "react";
import { MainContainer } from "@/components/MainContainer";
import { AppBar } from "@/components/AppBar";
import { HeaderTitle } from "@/components/HeaderTitle/HeaderTitle";
import { Box, Card } from "@mui/material";
import { DataGrid, GridColDef, GridDeleteForeverIcon } from "@mui/x-data-grid";
import { ErrorResult } from "@/components/ErrorResult";
import { useDialog } from "@/hooks/useDialog/useDialog";
import { EmptyResult } from "@/components/EmptyResult";
import { useJustifications } from "./useJustifications";
import { JustificationsDialog } from "@/components/JustificationsrDialog";
import { JustificationType } from "@/interfaces/parameters";
import LoadingTableSkeleton from "../../components/LoadingTableSkeleton/LoadingTableSkeleton";
import { JustificationFilterBar } from "@/components/JustificationFIlterBar/JustificationFIlterBar";

export function Justifications() {
  const {
    justifications,
    loadMore,
    isLoading,
    error: isError,
    hasData,
    currentPage,
    isLoadingDelete,
    isEmpty,
    totalCount,
    handleDeleteJustification,
    handleEditJustification,
    isToAddJustification,
    justificationId,
    handleClose,
    isLoadingMore,
  } = useJustifications();
  const { openDialog, closeDialog } = useDialog();

  const columns: GridColDef[] = [
    {
      field: "code",
      headerName: "Código",
      width: 200,
    },
    {
      field: "description",
      headerName: "Descrição",
      width: 400,
    },
    //TODO: Responsible Sector
    {
      field: "responsibleSector.description",
      headerName: "Setor Responsável",
      width: 400,
      renderCell: ({ row }: { row: JustificationType }) => {
        return (
          !!row.responsibleSector?.description &&
          row.responsibleSector?.description
        );
      },
    },
    {
      field: "type",
      headerName: "Tipo",
      width: 200,
      renderCell: ({ row }: { row: JustificationType }) => {
        return row.type === "null" ? "" : row.type;
      },
    },
    {
      field: " ",
      headerName: "",
      width: 100,
      renderCell: (params) => {
        return (
          <button
            disabled={isLoadingDelete}
            style={{
              paddingTop: 6,
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
                  body: "Deseja apagar este registro?",
                  onConfirm: async () => {
                    await handleDeleteJustification(params?.id as string).then(
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
        <HeaderTitle>Justificativas</HeaderTitle>
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
        <JustificationFilterBar />
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
          {isLoading && <LoadingTableSkeleton length={15} />}
          {isEmpty && !hasData && !isLoading && <EmptyResult />}
          {isError && !isLoading && <ErrorResult />}
          {hasData && !isLoading && (
            <div style={{ height: "100%", width: "100%" }}>
              <DataGrid
                slots={{
                  noRowsOverlay: EmptyResult,
                }}
                rows={justifications || []}
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
                disableRowSelectionOnClick
                rowCount={totalCount}
                columns={columns}
                onRowDoubleClick={(params) => {
                  handleEditJustification(params.id as string);
                }}
                initialState={{
                  pagination: {
                    paginationModel: { page: currentPage - 1, pageSize: 15 },
                  },
                }}
                onPaginationModelChange={(params) => {
                  loadMore(params.page + 1);
                }}
                pageSizeOptions={[15]}
                density="compact"
                loading={isLoadingMore}
              />
            </div>
          )}
        </Card>
      </Box>
      <JustificationsDialog
        open={!!justificationId || !!isToAddJustification}
        onClose={handleClose}
      />
    </MainContainer>
  );
}
