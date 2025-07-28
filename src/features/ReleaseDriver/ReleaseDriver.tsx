"use client";

import { AppBar } from "@/components/AppBar";
import { EmptyResult } from "@/components/EmptyResult";
import { HeaderTitle } from "@/components/HeaderTitle/HeaderTitle";
import { MainContainer } from "@/components/MainContainer";
import { ReleaseDriverFilterBar } from "@/components/RelaseDriverFilterBar";
import { ReleaseDriverDialog } from "@/components/ReleaseDriverDialog/ReleaseDriverDialog";
import { useHash } from "@/hooks/useHash";
import { useReleaseDriver } from "@/hooks/useReleaseDriver/useReleaseDriver";
import { Box, Card, CircularProgress } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import dayjs from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { columnsConfig } from "./configColumn";

export function ReleaseDriver() {
  const {
    showContent,
    drivers,
    isLoading,
    // isEmpty,
    origem,
    totalCount,
    // error,
    size,
    loadMore,
  } = useReleaseDriver();
  const router = useRouter();
  const params = useSearchParams();

  const [hash, setHash] = useHash();

  const handleOpenDialog = (id: string) => {
    setHash(`#releaseDriverId-${id}`);
  };

  const columns = columnsConfig({
    handleOpenDialog,
  });

  const handleCloseDialog = () => {
    setHash("");
  };

  const isOpen = hash.includes("releaseDriverId");

  useEffect(() => {
    if (
      !params.get("dtRef") ||
      !params.get("locOrig") ||
      !params.get("releaseStatus")
    ) {
      const dtRef = dayjs(params.get("dtRef")).isValid()
        ? dayjs(params.get("dtRef")).format("YYYY-MM-DD")
        : dayjs().format("YYYY-MM-DD");
      const locOrig = params.get("origemlocOrig") || "";
      if (dtRef && locOrig) {
        const newParams = new URLSearchParams();
        newParams.append("dtRef", dtRef);
        newParams.append("locOrig", locOrig);
        newParams.append(
          "releaseStatus",
          params.get("releaseStatus") === "true" ? "true" : "false",
        );
        if (params.get("nickName")) {
          newParams.append("nickName", params.get("nickName") || "");
        }
        if (params.get("fleetCode")) {
          newParams.append("fleetCode", params.get("fleetCode") || "");
        }
        if (params.get("demand")) {
          newParams.append("demand", params.get("demand") || "");
        }
        router.push(`/release-driver?${newParams.toString()}`);
      }
    }
  }, [params]);

  return (
    <MainContainer>
      <AppBar style={{ display: "block" }}>
        <HeaderTitle>Liberação de motoristas para viagens</HeaderTitle>
      </AppBar>

      <Box
        sx={{
          width: "1400px",
          height: "100%",
          margin: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <ReleaseDriverFilterBar />
        <Box
          sx={{
            width: "100%",
            alignSelf: "flex-start",
            padding: "10px 0",
          }}
        >
          <strong>ORIGEM:</strong> {origem}
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
          {!showContent && drivers.length === 0 && !isLoading && (
            <EmptyResult />
          )}
          {showContent && !isLoading && (
            <Box sx={{ height: "100%", width: "100%", overflowY: "auto" }}>
              <DataGrid
                rows={drivers}
                columns={columns}
                rowCount={totalCount}
                getRowId={(params) => params.dailyTripSectionId}
                onPaginationModelChange={(params) => {
                  loadMore(params.page + 1);
                }}
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
                onCellDoubleClick={(params) => {
                  setHash(`#vehiclePlanning-${params.row.id}`);
                }}
                initialState={{
                  pagination: {
                    paginationModel: { page: size - 1, pageSize: 100 },
                  },
                }}
                density="compact"
                pageSizeOptions={[15]}
              />
            </Box>
          )}
        </Card>
      </Box>
      <ReleaseDriverDialog open={!!isOpen} onClose={handleCloseDialog} />
    </MainContainer>
  );
}
