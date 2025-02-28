import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Box } from "@mui/material";
import { FormProvider } from "react-hook-form";
import { useGenerateVehiclePlanningDialog } from "./useGenerateVehiclePlanningDialog";
import { GenerateVehiclePlanningForm } from "./components/GenerateVehiclePlanningForm";
import { GenerateVehiclePlanningFormFooter } from "./components/GenerateVehiclePlanningFormFooter";

interface VehiclePlanningDetailsProps {
  open: boolean;
  onClose: () => void;
}

export function GenerateVehiclePlanningDialog({
  open,
  onClose,
}: VehiclePlanningDetailsProps) {
  const { methods, onSubmit } = useGenerateVehiclePlanningDialog({ onClose });
  const { handleSubmit } = methods;

  return (
    <Dialog onClose={onClose} open={open} maxWidth="lg">
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          <>
            <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
              <Box display="flex" justifyContent="space-between">
                Geração de associação diária de veículos
              </Box>
            </DialogTitle>
            <IconButton
              aria-label="close"
              onClick={onClose}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
            <DialogContent dividers sx={{ padding: "16px" }}>
              <GenerateVehiclePlanningForm />
            </DialogContent>
            <GenerateVehiclePlanningFormFooter />
          </>
        </form>
      </FormProvider>
    </Dialog>
  );
}
