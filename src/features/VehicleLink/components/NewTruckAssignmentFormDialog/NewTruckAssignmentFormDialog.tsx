import {
  DatePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Controller, FormProvider } from "react-hook-form";
import { useNewTruckAssigment } from "./useNewTruckAssignment";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from "@mui/material";
import { AutocompleteDriver } from "@/components/AutocompleteDriver";
import { AutocompleteTruck } from "@/components/AutocompleteTruck";
import CloseIcon from "@mui/icons-material/Close";

export const NewTruckAssingmentFormDialog = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { methods, onSubmit, loadingPostTruckAssignment } =
    useNewTruckAssigment();

  const handleClose = () => {
    methods.reset();
    onClose();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <Dialog onClose={handleClose} open={isOpen} maxWidth="lg">
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
        </DialogTitle>
        <hr style={{ opacity: 0.2, marginBottom: 1 }} />
        <DialogContent>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <Grid container gap={1} columns={12}>
                <Controller
                  name={"dtRef"}
                  control={methods.control}
                  render={({ field }) => (
                    <Grid item sm={2}>
                      <DatePicker label={"Data Ref."} {...field} />
                    </Grid>
                  )}
                />
                <Controller
                  name={"startTime"}
                  control={methods.control}
                  render={({ field }) => (
                    <Grid item sm={2}>
                      <TimePicker label={"Começo"} {...field} />
                    </Grid>
                  )}
                />
                <Controller
                  name={"endTime"}
                  control={methods.control}
                  render={({ field }) => (
                    <Grid item sm={2}>
                      <TimePicker label={"Fim"} {...field} />
                    </Grid>
                  )}
                />
                <Grid xs={2}>
                  <AutocompleteDriver name={"driverId"} />
                </Grid>
                <Grid xs={2}>
                  <AutocompleteTruck
                    name={"truckId"}
                    onChange={(value) =>
                      methods.setValue("truckId", value?.id || "")
                    }
                  />
                </Grid>
              </Grid>
              <hr style={{ opacity: 0.2, margin: "1rem 0" }} />
              <DialogActions>
                <Button
                  color="error"
                  variant="contained"
                  onClick={onClose}
                  disabled={loadingPostTruckAssignment}
                >
                  Cancelar
                </Button>
                <Button
                  variant="contained"
                  type="submit"
                  disabled={loadingPostTruckAssignment}
                >
                  {loadingPostTruckAssignment ? (
                    <CircularProgress size={"26px"} color="inherit" />
                  ) : (
                    "Criar"
                  )}
                </Button>
              </DialogActions>
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>
    </LocalizationProvider>
  );
};
