"use client";
import { AppBar } from "@/components/AppBar";
import { HeaderTitle } from "@/components/HeaderTitle/HeaderTitle";
import { ImportTripsFilterBar } from "@/components/ImportTripsFilterBar";
import { MainContainer } from "@/components/MainContainer";
import { useImportTrips } from "@/hooks/useImportTrips";
import { ImportGtms } from "@/interfaces/import-trips";
import { Box, Button, Card, CircularProgress, styled } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import dayjs from "dayjs";
import { UploadTripFileForm } from "@/components/UploadTripFileForm/UploadTripForm";
import DeleteIcon from "@mui/icons-material/Delete";
import ListAltIcon from "@mui/icons-material/ListAlt";
import { EmptyResult } from "@/components/EmptyResult";
import { ImportTripsDialog } from "@/components/ImportTripsDialog/ImportTripsDialog";

const CustomTableButton = styled(Button)(() => ({
  padding: 0,
  width: "10px",
  minWidth: "30px",
  "&:hover": {
    opacity: 0.7,
  },
}));

export function ImportTrips() {
  const {
    data,
    isLoading,
    hasParamsToSearch,
    handleDeleteDemand,
    importedTripId,
    handleImportedTrip,
    handleCloseDialog,
  } = useImportTrips();

  const columns: GridColDef[] = [
    {
      field: "FileName",
      headerName: "Nome do Arquivo",
      width: 300,
      valueGetter: (_, data: ImportGtms) => {
        return data.FileName ? data.FileName.split(".xlsx")[0] : "";
      },
    },
    {
      field: "LocationCode",
      headerName: "Cód. Loc",
      width: 100,
    },
    {
      field: "CreateAt",
      headerName: "Data criação",
      width: 200,
      valueGetter: (_, data: ImportGtms) => {
        return dayjs(data.CreateAt).format("DD-MM-YY HH:mm");
      },
    },
    {
      field: "action",
      headerName: "Ações",
      width: 100,
      renderCell: (params) => {
        return (
          <Box>
            <CustomTableButton
              onClick={() => handleImportedTrip(params.id as string)}
              size="small"
              variant="text"
            >
              <ListAltIcon color="success" />
            </CustomTableButton>
            <CustomTableButton
              onClick={() => handleDeleteDemand(params.id as string)}
              variant="text"
              size="small"
            >
              <DeleteIcon color="error" />
            </CustomTableButton>
          </Box>
        );
      },
    },
  ];

  const Content = () => {
    if (isLoading && hasParamsToSearch) return <CircularProgress />;
    if (data?.length)
      return (
        <DataGrid
          columns={columns}
          rows={data || []}
          getRowId={(row) => row.Id}
          density="compact"
          initialState={{
            pagination: {
              paginationModel: { pageSize: 15 },
            },
          }}
          onCellDoubleClick={(params) =>
            handleImportedTrip(params.id as string)
          }
        />
      );
    if (!data?.length) return <EmptyResult />;
  };
  return (
    <MainContainer
      sx={{
        overflow: "hidden",
      }}
    >
      <AppBar style={{ display: "block" }}>
        <HeaderTitle>Importação de viagens</HeaderTitle>
      </AppBar>
      <Box
        sx={{
          width: "100%",
          padding: "20px",
          minHeight: "790px",
          height: "auto",
        }}
      >
        <Box
          display={"flex"}
          flexDirection={"row"}
          gap={2}
          justifyContent={"space-between"}
          minHeight={"64px"}
          alignItems={"flex-start"}
        >
          <ImportTripsFilterBar />
          <UploadTripFileForm />
        </Box>

        <Card
          sx={{
            width: "100%",
            height: data?.length ? "calc(100% - 116px)" : "90%",
          }}
        >
          <Box
            width={"100%"}
            height={"100%"}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Content />
          </Box>
        </Card>
      </Box>
      <ImportTripsDialog open={!!importedTripId} onClose={handleCloseDialog} />
    </MainContainer>
  );
}
