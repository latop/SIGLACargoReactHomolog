"use client";

import React from "react";
import { MainContainer } from "@/components/MainContainer";
import { AppBar } from "@/components/AppBar";
import { HeaderTitle } from "@/components/HeaderTitle/HeaderTitle";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Card } from "@mui/material";
import { EmptyResult } from "@/components/EmptyResult";
import { ErrorResult } from "@/components/ErrorResult";
import { useHash } from "@/hooks/useHash";
import { useLines } from "@/hooks/useLines";
import { LinesFilterBar } from "@/components/LinesFilterBar";
import { UpdateLineDialog } from "@/components/UpdateLineDialog";

import { useLine } from "@/hooks/useLine";
import { useCopyLine } from "@/hooks/useCopyLine";
import { useDialog } from "@/hooks/useDialog/useDialog";
import { columnsConfig } from "./configColumn";
import LoadingTableSkeleton from "@/components/LoadingTableSkeleton/LoadingTableSkeleton";

export function Lines() {
  const [hash, setHash] = useHash();
  const lineId = hash.match(/#line-id-(.+)/)?.[1];
  const isToAddLine = hash.match("#add-line")?.[0];

  const { openDialog, closeDialog } = useDialog();

  const {
    lines,
    loadMoreLines,
    size,
    isLoading,
    isEmpty,
    error: isError,
    totalCount,
    hasData,
    refetchLines,
    isLoadingMore,
  } = useLines();
  const { handleDeleteLine, isLoadingDelete } = useLine();
  const { handleCopyLine, isLoadingCopy } = useCopyLine();

  const handleCloseDialog = () => {
    setHash("");
  };
  const handleAddLine = () => {
    setHash("add-line");
  };

  const columns = columnsConfig({
    closeDialog,
    openDialog,
    handleDelete: handleDeleteLine,
    isLoadingDelete,
    handleCopy: handleCopyLine,
    isLoadingCopy,
    refetchLines,
  });

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
          gap: "16px",
        }}
      >
        <LinesFilterBar isLoading={isLoading} onAddLine={handleAddLine} />
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
                      `${from}-${to} de ${
                        count !== -1 ? count : `mais de ${to}`
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
      <UpdateLineDialog open={!!lineId} onClose={handleCloseDialog} />
      <UpdateLineDialog
        open={!!isToAddLine}
        key={isToAddLine}
        onClose={handleCloseDialog}
      />
    </MainContainer>
  );
}
