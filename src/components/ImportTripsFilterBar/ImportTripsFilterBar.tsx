import { Button, Grid } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Controller, FormProvider } from "react-hook-form";
import { GridSearchIcon } from "@mui/x-data-grid";
import { useImportTripsFilterBar } from "./useImportTripsFilterBar";

export function ImportTripsFilterBar(props: React.HTMLProps<HTMLFormElement>) {
  const { methods, onSubmit } = useImportTripsFilterBar();
  const { control, handleSubmit } = methods;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} {...props}>
          <Grid container gap={1}>
            <Grid item xs={3.2}>
              <Controller
                name="startDate"
                rules={{ required: true }}
                control={control}
                render={({ field }) => <DatePicker label="Início" {...field} />}
              />
            </Grid>
            <Grid item xs={3.2}>
              <Controller
                name="endDate"
                rules={{ required: true }}
                control={control}
                render={({ field }) => <DatePicker label="Fim" {...field} />}
              />
            </Grid>

            <Grid item xs={0.5}>
              <Button
                type="submit"
                size="large"
                variant="contained"
                color="primary"
                fullWidth
              >
                <GridSearchIcon />
              </Button>
            </Grid>
          </Grid>
        </form>
      </FormProvider>
    </LocalizationProvider>
  );
}
