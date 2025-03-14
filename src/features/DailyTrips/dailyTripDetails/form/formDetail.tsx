import { Box } from "@mui/material";
import { useForm } from "react-hook-form";

import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import customParseFormat from "dayjs/plugin/customParseFormat";

import CloseIcon from "@mui/icons-material/Close";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import { FormProvider } from "react-hook-form";
import { DailyTripFooterDetail } from "./formDetailFooter";
import { DailyTripForm } from "./DailyTripForm";
import { useDailyTripMutation } from "@/services/mutation/daily-trips";
import { DailyTrip } from "@/interfaces/daily-trip";

dayjs.extend(customParseFormat);

interface Params {
  initialValues: DailyTrip;
  handleClose: () => void;
}
export const DailyTripFormDetail = ({ initialValues, handleClose }: Params) => {
  const { mutateAsync, isError, error } = useDailyTripMutation();

  const methods = useForm({
    defaultValues: initialValues,
  });

  const onSubmit = async (data: DailyTrip) => {
    const response = await mutateAsync(data);
    console.log("response", response);
    if (response === "ok") {
      handleClose();
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
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
          {isError && <div>{JSON.stringify(error)}</div>}
          <DailyTripForm />
        </DialogContent>
        <DailyTripFooterDetail />
      </form>
    </FormProvider>
  );
};
