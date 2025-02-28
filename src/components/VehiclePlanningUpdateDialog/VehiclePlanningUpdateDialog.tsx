import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useToast } from "@/hooks/useToast";
import { Box, CircularProgress } from "@mui/material";
import { FieldValues, FormProvider } from "react-hook-form";
import { useVehiclePlanningUpdateDialog } from "./useVehiclePlanningUpdateDialog";
import { useVehiclePlanningDetails } from "@/hooks/useVehiclePlanningDetails";
import { VehiclePlanningForm } from "./components/VehiclePlanningForm";
import { VehiclePlanningFormFooter } from "./components/VehiclePlanningFormFooter";
import { useVehiclePlannings } from "@/hooks/useVehiclePlannings";
import { useHash } from "@/hooks/useHash";

interface VehiclePlanningDetailsProps {
  open: boolean;
  onClose: () => void;
}

export function VehiclePlanningUpdateDialog({
  open,
  onClose,
}: VehiclePlanningDetailsProps) {
  const { addToast } = useToast();
  const [hash] = useHash();
  const match = (hash as string).match(/#vehiclePlanning-(.+)/);

  const vehiclePlanningId = match?.[1];

  const {
    updateVehiclePlanning,
    deleteVehiclePlanning,
    isLoading: isLoadingDetails,
  } = useVehiclePlanningDetails();

  const { refetch } = useVehiclePlannings();
  const { vehiclePlanningDetails, isLoading, methods } =
    useVehiclePlanningUpdateDialog();

  const onSubmit = async (data: FieldValues) => {
    if (vehiclePlanningDetails) {
      await handleUpdate(data);
    }
  };

  const handleUpdate = async (data: FieldValues) => {
    const body = {
      id: vehiclePlanningDetails?.id,
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

    await updateVehiclePlanning(body, {
      onSuccess: () => {
        addToast("Salvo com sucesso!");
        refetch();
        onClose();
      },
      onError: () => {
        addToast("Erro ao salvar viagem", { type: "error" });
      },
    });
  };

  const handleDelete = async () => {
    await deleteVehiclePlanning(vehiclePlanningId, {
      onSuccess: () => {
        addToast("Viagem deletada com sucesso!", { type: "success" });
        onClose();
        refetch();
      },
      onError: () => {
        addToast("Error ao deletar viagem.", { type: "error" });
        onClose();
        refetch();
      },
    });
  };

  const { formState } = methods;
  const { defaultValues } = formState;
  const loading =
    isLoadingDetails ||
    isLoading ||
    (vehiclePlanningDetails && !defaultValues?.id);

  const handleClose = () => {
    onClose();
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
                Atualizar planejamento de veículo
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
            <VehiclePlanningFormFooter onDelete={handleDelete} />
          </>
        </form>
      </FormProvider>
    </Dialog>
  );
}
