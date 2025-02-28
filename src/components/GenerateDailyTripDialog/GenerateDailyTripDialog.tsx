import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { Controller, FormProvider } from "react-hook-form";
import { useGenerateDailyTrip } from "./useGenerateDailyTripDialog";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { AutocompleteFleetGroup } from "../AutocompleteFleetGroup";
import { AutocompleteLocationGroup } from "../AutocompleteLocationGroup";
import { useDialog } from "@/hooks/useDialog/useDialog";

export const GenerateDailyTripDialog = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { methods, handleSubmit, loadingGenerateTrip } = useGenerateDailyTrip();
  const { control } = methods;

  const { openDialog } = useDialog();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <Dialog
        onClose={onClose}
        open={isOpen}
        fullWidth
        PaperProps={{ sx: { maxWidth: "800px" } }}
      >
        <FormProvider {...methods}>
          <form>
            <DialogTitle>Gerar viagem diária</DialogTitle>
            <DialogContent>
              <Grid paddingTop={1} container gap={1} width={"100%"}>
                <Grid item xs={3}>
                  <Controller
                    name="startDate"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        disabled={false}
                        label="Início planejado"
                        {...field}
                        value={field.value ? dayjs(field.value) : null}
                        onChange={(date) => field.onChange(date?.format())}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={3}>
                  <Controller
                    name="endDate"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        disabled={false}
                        label="Fim planejado"
                        {...field}
                        value={field.value ? dayjs(field.value) : null}
                        onChange={(date) => field.onChange(date?.format())}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={2.5}>
                  <AutocompleteFleetGroup />
                </Grid>
                <Grid item xs={2.5}>
                  <AutocompleteLocationGroup />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button
                variant="outlined"
                onClick={onClose}
                disabled={loadingGenerateTrip}
              >
                Cancelar
              </Button>
              <Button
                variant="contained"
                disabled={loadingGenerateTrip}
                onClick={() =>
                  openDialog({
                    title: "Confirmar",
                    message: "Geração de viagem",
                    onConfirm: () => handleSubmit(),
                  })
                }
              >
                {loadingGenerateTrip ? <CircularProgress /> : "Gerar Viagem"}
              </Button>
            </DialogActions>
          </form>
        </FormProvider>
      </Dialog>
    </LocalizationProvider>
  );
};
