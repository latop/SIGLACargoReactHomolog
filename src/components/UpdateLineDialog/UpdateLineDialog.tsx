import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { UpdateLineForm } from "./components/UpdateLineForm";
import { Box, CircularProgress } from "@mui/material";
import { FormProvider } from "react-hook-form";
import { useUpdateLineDialog } from "./useUpdateLineDialog";
import { UpdateLineFormFooter } from "./components/UpdateLineFormFooter";

interface DailyTripDetailsProps {
  open: boolean;
  onClose: () => void;
}

export function UpdateLineDialog({ open, onClose }: DailyTripDetailsProps) {
  const { methods, handleSubmit, isLoadingLine } = useUpdateLineDialog();

  const handleClose = () => {
    methods.reset();
    onClose();
  };

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      fullWidth
      PaperProps={{ sx: { height: "auto", maxWidth: "1300px" } }}
    >
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(handleSubmit)}
          style={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
            <Box display="flex" justifyContent="space-between">
              Atualizar Rota
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
          {!isLoadingLine ? (
            <DialogContent dividers sx={{ padding: "16px" }}>
              <UpdateLineForm />
            </DialogContent>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexGrow: 1,
                alignItems: "center",
                justifyContent: "center",
                padding: "32px",
              }}
            >
              <CircularProgress />
            </Box>
          )}
          {!isLoadingLine && <UpdateLineFormFooter />}
        </form>
      </FormProvider>
    </Dialog>
  );
}
