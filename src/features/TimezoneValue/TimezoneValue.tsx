"use client";

import React from "react";
import { MainContainer } from "@/components/MainContainer";
import { AppBar } from "@/components/AppBar";
import { HeaderTitle } from "@/components/HeaderTitle/HeaderTitle";
import { Box, Button, Card } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { ErrorResult } from "@/components/ErrorResult";
import { useDialog } from "@/hooks/useDialog/useDialog";
import { EmptyResult } from "@/components/EmptyResult";
import LoadingTableSkeleton from "@/components/LoadingTableSkeleton/LoadingTableSkeleton";

import { TimezoneValueDialog } from "@/components/TimezoneValueDialog/TimezoneValueDialog";
import { useTimezoneValue } from "./useTimezoneValue";
import { columnsConfig } from "./configColumn";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";

import customParseFormat from "dayjs/plugin/customParseFormat";
import "dayjs/locale/pt-br";
import dayjs from "dayjs";

dayjs.extend(customParseFormat);

export function TimezoneValue() {
  const {
    timezoneValues,
    loadMore,
    isLoading,
    error: isError,
    hasData,
    currentPage,
    isLoadingDelete,
    isEmpty,
    totalCount,
    handleDeleteTimezoneValue,
    handleEditTimezoneValue,
    isToAddTimezoneValue,
    timezoneValueId,
    handleClose,
    isLoadingMore,
    handleAddTimezoneValue,
  } = useTimezoneValue();
  const { openDialog, closeDialog } = useDialog();

  const columns = columnsConfig({
    closeDialog,
    openDialog,
    handleDelete: handleDeleteTimezoneValue,
    isLoadingDelete,
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <MainContainer>
        <AppBar>
          <HeaderTitle>Valores de Fuso Horário</HeaderTitle>
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
            onClick={handleAddTimezoneValue}
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
                  key={totalCount}
                  sx={{
                    width: "100%",
                    "& .blueColumnHeaders ": {
                      backgroundColor: "#24438F",
                      color: "white",
                    },
                  }}
                  slots={{
                    noRowsOverlay: EmptyResult,
                  }}
                  loading={isLoadingMore}
                  rows={timezoneValues || []}
                  getRowId={(row) => row.id}
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
                  disableRowSelectionOnClick
                  rowCount={totalCount}
                  columns={columns}
                  onRowDoubleClick={(params) => {
                    handleEditTimezoneValue(params.id as string);
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
        <TimezoneValueDialog open={!!timezoneValueId} onClose={handleClose} />
        <TimezoneValueDialog
          open={!!isToAddTimezoneValue}
          onClose={handleClose}
        />
      </MainContainer>
    </LocalizationProvider>
  );
}
