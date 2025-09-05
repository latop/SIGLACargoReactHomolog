"use client";

import React from "react";
import { MainContainer } from "@/components/MainContainer";
import { AppBar } from "@/components/AppBar";
import { HeaderTitle } from "@/components/HeaderTitle/HeaderTitle";
import { DeparturesArrivalsFilterBar } from "@/components/DeparturesArrivalsFilterBar";
import { Box, Card } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { EmptyResult } from "@/components/EmptyResult";
import { ErrorResult } from "@/components/ErrorResult";
import LoadingTableSkeleton from "@/components/LoadingTableSkeleton/LoadingTableSkeleton";
import { useDeparturesArrivals } from "./useDeparturesArrivals";
import { columnsConfig } from "./columnsConfig";

export function DeparturesArrivals() {
  const {
    departuresArrivals,
    isLoading,
    isError,
    hasData,
    currentPage,
    totalCount,
    loadMore,
    isLoadingMore,
  } = useDeparturesArrivals({
    revalidateOnMount: true,
    refreshInterval: 30 * 60 * 1000, // 30min
  });

  const columns = columnsConfig();

  return (
    <MainContainer>
      <AppBar>
        <HeaderTitle>Partidas e chegadas</HeaderTitle>
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
        <DeparturesArrivalsFilterBar />
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
          {!hasData && !isLoading && <EmptyResult />}
          {isError && !isLoading && <ErrorResult />}
          {hasData && !isLoading && (
            <div style={{ height: "100%", width: "100%" }}>
              <DataGrid
                key={totalCount}
                slots={{
                  noRowsOverlay: EmptyResult,
                }}
                loading={isLoadingMore}
                rows={departuresArrivals || []}
                getRowId={(row) => row.seq}
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
    </MainContainer>
  );
}
