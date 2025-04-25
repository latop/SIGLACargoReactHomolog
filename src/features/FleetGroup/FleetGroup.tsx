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
import { useFleetGroup } from "./useFleetGroup";
import { columnsConfig } from "./configColumn";
import { FleetGroupDialog } from "@/components/FleetGroupDialog";

export function FleetGroup() {
  const {
    fleetGroups,
    loadMore,
    isLoading,
    error: isError,
    hasData,
    currentPage,
    isLoadingDelete,
    isEmpty,
    totalCount,
    handleDeleteFleetGroup,
    handleAddFleetGroup,
    handleEditFleetGroup,
    isToAddFleetGroup,
    fleetGroupId,
    handleClose,
    isLoadingMore,
  } = useFleetGroup();
  const { openDialog, closeDialog } = useDialog();

  const columns = columnsConfig({
    closeDialog,
    openDialog,
    handleDelete: handleDeleteFleetGroup,
    isLoadingDelete,
  });

  return (
    <MainContainer>
      <AppBar>
        <HeaderTitle>Grupos de Frota</HeaderTitle>
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
          onClick={handleAddFleetGroup}
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
                rows={fleetGroups || []}
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
                  handleEditFleetGroup(params.id as string);
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
      <FleetGroupDialog open={!!fleetGroupId} onClose={handleClose} />
      <FleetGroupDialog open={!!isToAddFleetGroup} onClose={handleClose} />
    </MainContainer>
  );
}
