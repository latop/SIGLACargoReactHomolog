import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Box, CircularProgress } from "@mui/material";
import { FormProvider } from "react-hook-form";
import { useTrucksDialog } from "./useTrucksDialog";
import { TruckForm } from "./components/TruckForm";
import { TruckFormFooter } from "./components/TruckFormFooter";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

interface TrucksDialogProps {
  open: boolean;
  onClose: () => void;
}

export function TrucksDialog({ open, onClose }: TrucksDialogProps) {
  const { methods, loadingTruckFetch, dialogTitle, onSubmit, isLoadingTruck } =
    useTrucksDialog();

  const handleClose = () => {
    methods.reset({});
    onClose();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <Dialog
        onClose={handleClose}
        open={open}
        fullWidth
        PaperProps={{ sx: { height: "auto", maxWidth: "1300px" } }}
      >
        <FormProvider {...methods}>
          <form
            onSubmit={onSubmit}
            style={{ display: "flex", flexDirection: "column", height: "100%" }}
          >
            <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
              <Box display="flex" justifyContent="space-between">
                {dialogTitle}
              </Box>
            </DialogTitle>
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
            {isLoadingTruck ? (
              <Box
                sx={{
                  display: "flex",
                  flexGrow: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "32px",
                  minHeight: "253px",
                }}
              >
                <CircularProgress />
              </Box>
            ) : (
              <DialogContent dividers sx={{ padding: "16px" }}>
                <TruckForm />
              </DialogContent>
            )}
            {!loadingTruckFetch && <TruckFormFooter onClose={handleClose} />}
          </form>
        </FormProvider>
      </Dialog>
    </LocalizationProvider>
  );
}
