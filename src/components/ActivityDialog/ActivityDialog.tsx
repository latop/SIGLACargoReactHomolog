import React, { useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import dayjs from "dayjs";
import { useFetch } from "@/hooks/useFetch";
import { FieldValues, FormProvider, useForm } from "react-hook-form";
import { ActivityRequest, Trip } from "@/interfaces/schedule";
import { ActivityFooter } from "./components/ActivityFooter";
import { ActivityHeader } from "./components/ActivityHeader";
import { ActivityForm } from "./components/ActivityForm";
import { useToast } from "@/hooks/useToast";
import { useJourneysByPeriod } from "@/hooks/useJourneysByPeriod";
import { useActivityDialog } from "./useActivityDialog";

interface ActivityDialogProps {
  open: boolean;
  onClose: () => void;
}

export function ActivityDialog({ open, onClose }: ActivityDialogProps) {
  const { currentTrip } = useActivityDialog();
  const { addActivity } = useJourneysByPeriod();
  const { addToast } = useToast();

  const [postActivity] = useFetch();

  const onSubmit = async (data: FieldValues) => {
    const body: ActivityRequest = {
      journeyDate: data.journeyDate,
      driverId: data.driverId,
      activityId: data.activityId,
      startActivity: data.startActivity,
      endActivity: data.endActivity,
      qtyOccur: 1,
      operation: "INSERT",
    };

    await postActivity("/Schedule/UpdateActivity", body, {
      onSuccess: () => {
        addToast("Atividade salva com sucesso");
        const trip: Trip = {
          code: data.activityCode,
          startPlanned: data.startActivity,
          endPlanned: data.endActivity,
          driverId: data.driverId,
          driverName: data.nickName,
          tripType: "TRIP",
        };
        addActivity(trip);
        onClose();
      },
      onError: () => {
        addToast("Erro ao salvar atividade", { type: "error" });
      },
    });
  };

  const methods = useForm({
    defaultValues: {
      journeyDate: new Date(),
      startActivity: new Date(),
      endActivity: new Date(),
      activityCode: "",
      activityId: "",
      nickName: "",
    },
  });

  useEffect(() => {
    if (currentTrip) {
      methods.reset({
        journeyDate: dayjs(currentTrip.startPlanned).toDate(),
        startActivity: dayjs(currentTrip.startPlanned).toDate(),
        endActivity: dayjs(currentTrip.endPlanned).toDate(),
        activityCode: currentTrip.code,
        activityId: "",
        nickName: currentTrip.driverName,
      });
    }
  }, [currentTrip]);

  return (
    <Dialog
      onClose={onClose}
      open={open}
      fullWidth
      PaperProps={{ sx: { maxWidth: "550px" } }}
    >
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          style={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          <>
            <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
              <ActivityHeader />
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
              <ActivityForm />
            </DialogContent>
            <ActivityFooter onClose={onClose} />
          </>
        </form>
      </FormProvider>
    </Dialog>
  );
}
