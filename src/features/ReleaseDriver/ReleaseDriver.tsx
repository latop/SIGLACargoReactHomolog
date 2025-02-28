"use client";

import { AppBar } from "@/components/AppBar";
import { EmptyResult } from "@/components/EmptyResult";
import { HeaderTitle } from "@/components/HeaderTitle/HeaderTitle";
import { MainContainer } from "@/components/MainContainer";
import { ReleaseDriverFilterBar } from "@/components/RelaseDriverFilterBar";
import { ReleaseDriverDialog } from "@/components/ReleaseDriverDialog/ReleaseDriverDialog";
import { useHash } from "@/hooks/useHash";
import { useReleaseDriver } from "@/hooks/useReleaseDriver/useReleaseDriver";
import { ReleaseDriverInterface } from "@/interfaces/release-driver";
import { Box, Card, CircularProgress, IconButton } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import dayjs from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { FaEdit } from "react-icons/fa";

export function ReleaseDriver() {
  const columns: GridColDef[] = [
    {
      field: "saida",
      headerName: "SAÍDA",
      width: 140,
      valueGetter: (_, data: ReleaseDriverInterface) => {
        return data.saida ? data.saida : "";
      },
    },
    {
      field: "entrega",
      headerName: "ENTREGA",
      width: 140,
      valueGetter: (_, data: ReleaseDriverInterface) => {
        return data.entrega ? data.entrega : "";
      },
    },
    {
      field: "demanda",
      headerName: "DEMANDA",
      width: 150,

      valueGetter: (_, data: ReleaseDriverInterface) => {
        return data.demanda ? data.demanda : "";
      },
    },
    {
      field: "destino",
      headerName: "DESTINO",
      width: 110,
      valueGetter: (_, data: ReleaseDriverInterface) => {
        return data.destino ? data.destino : "";
      },
    },
    {
      field: "motoristaPlan",
      headerName: "MOT.PLAN.",
      width: 140,
      valueGetter: (_, data: ReleaseDriverInterface) => {
        return data.motoristaPlan ? data.motoristaPlan : "";
      },
    },
    {
      field: "veiculoPlan",
      headerName: "VEÍCULO PLAN.",
      width: 140,
      valueGetter: (_, data: ReleaseDriverInterface) => {
        return data.veiculoPlan ? data.veiculoPlan : "";
      },
    },
    {
      field: "dtCheckList",
      headerName: "CHECK-LIST",
      width: 140,
      renderCell: (params) => {
        if (
          params.row.dtCheckList === null ||
          params.row.dtCheckList === undefined
        )
          return (
            <IconButton
              onClick={() => handleOpenDialog(params.row.dailyTripSectionId)}
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                color: "#24438f",
                cursor: "pointer",
              }}
            >
              <FaEdit />
            </IconButton>
          );
        return params.row.dtCheckList;
      },
    },

    {
      field: "motoristaLiberado",
      headerName: "MOT.REAL.",
      width: 140,
      valueGetter: (_, data: ReleaseDriverInterface) => {
        return data.motoristaLiberado ? data.motoristaLiberado : "";
      },
    },
    {
      field: "veiculoLiberado",
      headerName: "VEÍCULO.REAL.",
      width: 150,
      valueGetter: (_, data: ReleaseDriverInterface) => {
        return data.veiculoLiberado ? data.veiculoLiberado : "";
      },
    },
    {
      field: "dtLiberacao",
      headerName: "LIBERAÇÃO",
      width: 140,
      renderCell: (params) => {
        return params.row.dtLiberacao
          ? dayjs(params.row.dtLiberacao).format("DD/MM/YYYY HH:mm")
          : "";
      },
    },
  ];

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

  const handleCloseDialog = () => {
    console.log("handleClose");
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
            height: "90%",
            margin: "10px auto 20px",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {isLoading && <CircularProgress />}
          {drivers.length === 0 && !isLoading && <EmptyResult />}
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
                      `${from}-${to} de ${count !== -1 ? count : `mais de ${to}`
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
                pageSizeOptions={[10]}
              />
            </Box>
          )}
        </Card>
      </Box>
      <ReleaseDriverDialog open={!!isOpen} onClose={handleCloseDialog} />
    </MainContainer>
  );
}
