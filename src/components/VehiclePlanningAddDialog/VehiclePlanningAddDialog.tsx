import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useToast } from "@/hooks/useToast";
import { Box, CircularProgress } from "@mui/material";
import { FieldValues, FormProvider } from "react-hook-form";
import { useVehiclePlanningAddDialog } from "./useVehiclePlanningAddDialog";
import { useVehiclePlanningDetails } from "@/hooks/useVehiclePlanningDetails";
import { VehiclePlanningForm } from "./components/VehiclePlanningForm";
import { VehiclePlanningFormFooter } from "./components/VehiclePlanningFormFooter";
import { useVehiclePlannings } from "@/hooks/useVehiclePlannings";

interface VehiclePlanningDetailsProps {
  open: boolean;
  onClose: () => void;
}

export function VehiclePlanningAddDialog({
  open,
  onClose,
}: VehiclePlanningDetailsProps) {
  const { addToast } = useToast();

  const { createVehiclePlanning } = useVehiclePlanningDetails();

  const { refetch } = useVehiclePlannings();
  const { vehiclePlanningDetails, isLoading, methods } =
    useVehiclePlanningAddDialog();

  const onSubmit = async (data: FieldValues) => {
    await handleCreate(data);
  };

  const handleCreate = async (data: FieldValues) => {
    const body = {
      driverId: data.driver?.id,
      truckId: data.truck?.id,
      startTime: data.startTime,
      endTime: data.endTime,
      freqFri: data.freqFri ? 1 : 0,
      freqMon: data.freqMon ? 1 : 0,
      freqSat: data.freqSat ? 1 : 0,
      freqSun: data.freqSun ? 1 : 0,
      freqThu: data.freqThu ? 1 : 0,
      freqTue: data.freqTue ? 1 : 0,
      freqWed: data.freqWed ? 1 : 0,
      startDate: data.startDate,
      endDate: data.endDate,
    };
    await createVehiclePlanning(body, {
      onSuccess: () => {
        addToast("Viagem criada com sucesso");
        refetch();
        onClose();
        methods.reset();
      },
      onError: () => {
        addToast("Erro ao criar viagem", { type: "error" });
      },
    });
  };

  const { formState } = methods;
  const { defaultValues } = formState;
  const loading = isLoading || (vehiclePlanningDetails && !defaultValues?.id);

  const handleClose = () => {
    onClose();
    methods.reset();
  };
  const { handleSubmit } = methods;

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      fullWidth
      PaperProps={{ sx: { maxWidth: "1020px" } }}
    >
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          <>
            <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
              <Box display="flex" justifyContent="space-between">
                Adicionar planejamento de veículo
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
            <DialogContent dividers sx={{ padding: "16px" }}>
              {loading && (
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  padding="10px"
                  height="100%"
                >
                  <CircularProgress />
                </Box>
              )}
              {!loading && <VehiclePlanningForm />}
            </DialogContent>
            <VehiclePlanningFormFooter />
          </>
        </form>
      </FormProvider>
    </Dialog>
  );
}
