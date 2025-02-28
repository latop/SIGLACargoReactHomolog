"use client";

import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useTruckAssignmentDialog } from "./useTruckAssingmentDialog";
import dayjs from "dayjs";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Driver } from "@/interfaces/driver";
import { Truck } from "@/interfaces/vehicle";

export const TruckAssignmentDialog = ({
  isOpen = false,
  onClose,
}: {
  isOpen: boolean;
  onClose?: () => void;
}) => {
  const { data, isLoading, truckAssignmentId, handleDelete, loadingDeletion } =
    useTruckAssignmentDialog();

  const columns: GridColDef[] = [
    {
      field: "truckId",
      headerName: "Placa do caminhão",
      width: 150,

      valueGetter: (_, data: { truck: Truck }) => data?.truck?.licensePlate,
    },
    {
      field: "driver",
      headerName: "Nome do motorista",
      width: 150,
      valueGetter: (_, data: { driver: Driver }) => data?.driver?.name,
    },
    {
      field: "dtRef",
      headerName: "Data de Referência",
      width: 150,
      valueGetter: (_, data) => {
        return data.dtRef ? dayjs(data.dtRef).format("DD-MM-YY HH:mm") : "";
      },
    },

    {
      field: "startTime",
      headerName: "Começo",
      width: 180,
      valueGetter: (_, data) => {
        return data.startTime
          ? dayjs(data.startTime).format("DD-MM-YY HH:mm")
          : "";
      },
    },
    {
      field: "endTime",
      headerName: "Fim",
      width: 150,
      valueGetter: (_, data) => {
        return data.endTime ? dayjs(data.endTime).format("DD-MM-YY HH:mm") : "";
      },
    },
  ];
  const rows = [data];

  const onDelete = async () => {
    await handleDelete();
    onClose?.();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth={"lg"}>
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        <Box display="flex" justifyContent="space-between">
          Atribuição de caminhão
          <Button
            type="submit"
            variant="text"
            color="inherit"
            onClick={onClose}
          >
            <CloseIcon sx={{ cursor: "pointer", opacity: 0.6 }} />
          </Button>
        </Box>

        <hr style={{ opacity: 0.2, margin: "1rem 0" }} />
      </DialogTitle>
      <DialogContent sx={{ display: "flex", alignItems: "center" }}>
        {isLoading && <CircularProgress sx={{ margin: "auto" }} />}
        {data && !isLoading && (
          <DataGrid
            rows={rows}
            getRowId={() => (truckAssignmentId as string) || ""}
            columns={columns}
            autoHeight
            hideFooter
          />
        )}
      </DialogContent>
      {!isLoading && (
        <DialogActions>
          <Box
            display="flex"
            justifyContent="flex-end"
            gap={1}
            padding="10px"
            width="100%"
          >
            <Button
              type="submit"
              variant="contained"
              color="error"
              onClick={onDelete}
              disabled={loadingDeletion}
            >
              {loadingDeletion ? (
                <CircularProgress color="inherit" size="16px" />
              ) : (
                <>
                  Excluir
                  <DeleteIcon />
                </>
              )}
            </Button>
            <Button type="submit" variant="contained" onClick={onClose}>
              <p>Fechar</p>
              <CloseIcon sx={{ cursor: "pointer" }} />
            </Button>
          </Box>
        </DialogActions>
      )}
    </Dialog>
  );
};
