"use client";

import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { Box, Button, CircularProgress, DialogActions } from "@mui/material";

import { useTripOptimizationDialog } from ".";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import dayjs from "dayjs";

interface TripOptimizationDialogProps {
  open: boolean;
  onClose: () => void;
}

export function TripOptimizationDialog({
  open,
  onClose,
}: TripOptimizationDialogProps) {
  const { data, isLoading } = useTripOptimizationDialog();
  // const { addToast } = useToast();

  const handleClose = () => {
    onClose();
  };

  const columns: GridColDef[] = [
    {
      field: "nickName",
      headerName: "Nome",
      width: 150,
    },
    {
      field: "sto",
      headerName: "Sto",
      width: 150,

      valueGetter: (_, data) => {
        return data.sto ? data.sto : "";
      },
    },
    {
      field: "journeyDate",
      headerName: "Data da viagem",
      width: 150,
      valueGetter: (_, data) => {
        return dayjs(data.journeyDate).format("DD/MM/YYYY");
      },
    },
  ];

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      fullWidth
      PaperProps={{ sx: { height: "50%", maxWidth: "900px" } }}
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        <Box display="flex" justifyContent="space-between">
          Detalhes do Processamento
        </Box>
      </DialogTitle>
      <DialogContent dividers sx={{ padding: "20px" }}>
        {isLoading ? (
          <Box
            height={"100%"}
            width={"100%"}
            display={"flex"}
            alignItems="center"
            justifyContent="center"
          >
            <CircularProgress />
          </Box>
        ) : (
          <DataGrid
            columns={columns}
            rows={data?.otmDetails || []}
            hideFooterPagination={true}
            autoHeight
          />
        )}
      </DialogContent>
      <DialogActions>
        <Box display="flex" justifyContent="flex-end" padding="10px">
          <Box display="flex" gap="10px">
            <Button variant="contained" color="error" onClick={onClose}>
              Fechar
            </Button>
          </Box>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
