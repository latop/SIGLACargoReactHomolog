import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useToast } from "@/hooks/useToast";
import { Box, CircularProgress } from "@mui/material";
import { FieldValues, FormProvider } from "react-hook-form";
import { useDailyTripDetails } from "@/hooks/useDailyTripDetails";
import { DailyTripDetailsForm } from "./components/DailyTripsDetailsForm/DailyTripDetailsForm";
import {
  DailyTripSection,
  useDailyTripDetailsDialog,
} from "./useDailyTripDetailsDialog";
import { DailyTripsFormDetailsFooter } from "./components/DailyTripsDetailsForm/DailyTripsFormDetailsFooter";
import { useDailyTrips } from "@/features/DailyTrips/useDailyTrips";

interface DailyTripDetailsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DailyTripDetailsDialog({
  isOpen,
  onClose,
}: DailyTripDetailsProps) {
  const { addToast } = useToast();

  const { updateDailyTripDetails } = useDailyTripDetails();
  const { refetchDailyTrips } = useDailyTrips();
  const onSubmit = async (data: FieldValues) => {
    const { dailyTripSections, ...dailyTrips } = data;

    const cleanedDailyTrip = {
      ...dailyTrips,
      company: dailyTrips.company?.name || null,
      justification: dailyTrips.justificationId
        ? dailyTrips.justification
        : null,
    };

    const cleanedSections = dailyTripSections.map(
      (section: DailyTripSection) => ({
        ...section,
        truck: section.truck?.licensePlate ? section.truck : null,
      }),
    );

    const body = {
      dailyTrip: cleanedDailyTrip,
      dailyTripSections: cleanedSections,
    };

    await updateDailyTripDetails(body, {
      onSuccess: () => {
        addToast("Salvo com sucesso!");
        refetchDailyTrips();
        onClose();
      },
      onError: () => {
        addToast("Erro ao salvar viagem", { type: "error" });
      },
    });
  };

  const { dailyTripDetails, isLoading, methods } = useDailyTripDetailsDialog();
  const { formState } = methods;
  const { defaultValues } = formState;
  const loading = isLoading || (dailyTripDetails && !defaultValues?.id);

  const handleClose = () => {
    onClose();
    methods.reset({});
  };
  const { handleSubmit } = methods;

  return (
    <Dialog
      onClose={handleClose}
      open={isOpen}
      fullWidth
      PaperProps={{ sx: { height: "100%", maxWidth: "1400px" } }}
    >
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
            <Box display="flex" justifyContent="space-between">
              Viagem diária
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
            {!loading && <DailyTripDetailsForm />}
          </DialogContent>
          <DailyTripsFormDetailsFooter />
        </form>
      </FormProvider>
    </Dialog>
  );
}
