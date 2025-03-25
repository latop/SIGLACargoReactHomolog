"use client";

import React from "react";
import { MainContainer } from "@/components/MainContainer";
import { AppBar } from "@/components/AppBar";
import { HeaderTitle } from "@/components/HeaderTitle/HeaderTitle";
import { Box, Button, Card } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useActivityType } from "./useActivityType";
import { ErrorResult } from "@/components/ErrorResult";
import { useDialog } from "@/hooks/useDialog/useDialog";
import { EmptyResult } from "@/components/EmptyResult";
import LoadingTableSkeleton from "@/components/LoadingTableSkeleton/LoadingTableSkeleton";
import { columnsConfig } from "./columnsConfig";
import { ActivityTypeDialog } from "@/components/ActivityTypeDialog";

export function ActivityType() {
  const {
    activityType,
    loadMore,
    isLoading,
    error: isError,
    hasData,
    currentPage,
    handleDeleteActivityType,
    isLoadingDelete,
    isEmpty,
    totalCount,
    handleAddActivityType,
    handleEditActivityType,
    isToAddActivityType,
    activityTypeId,
    handleClose,
    isLoadingMore,
  } = useActivityType();
  const { openDialog, closeDialog } = useDialog();
  const columns = columnsConfig({
    closeDialog,
    openDialog,
    handleDeleteActivityType,
    isLoadingDelete,
  });
  return (
    <MainContainer>
      <AppBar>
        <HeaderTitle>Tipo de Atividade</HeaderTitle>
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
        <Button
          onClick={handleAddActivityType}
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
          {isLoading && <LoadingTableSkeleton length={15} />}
          {isEmpty && !hasData && !isLoading && <EmptyResult />}
          {isError && !isLoading && <ErrorResult />}
          {hasData && !isLoading && (
            <div style={{ height: "100%", width: "100%" }}>
              <DataGrid
                slots={{
                  noRowsOverlay: EmptyResult,
                }}
                loading={isLoadingMore}
                rows={activityType || []}
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
                  handleEditActivityType(params.id as string);
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
              />
            </div>
          )}
        </Card>
      </Box>
      <ActivityTypeDialog open={!!activityTypeId} onClose={handleClose} />
      <ActivityTypeDialog open={!!isToAddActivityType} onClose={handleClose} />
    </MainContainer>
  );
}
