import { Button, Grid, MenuItem, TextField } from "@mui/material";
import { GridSearchIcon } from "@mui/x-data-grid";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Controller, FormProvider } from "react-hook-form";
import { AutocompleteDriver } from "../AutocompleteDriver";
import { AutocompleteFleetGroup } from "../AutocompleteFleetGroup";
import { AutocompleteLocationRelease } from "../AutocompleteLocationRelease";
import { useReleaseDriverFilterBar } from "./useRealeseDriverFilterBar";

export function ReleaseDriverFilterBar(
  props: React.HTMLProps<HTMLFormElement>,
) {
  const { methods, onSubmit } = useReleaseDriverFilterBar();
  const { control, handleSubmit } = methods;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ width: "100%" }}
          {...props}
        >
          <Grid container padding="20px 20px 20px 0" spacing={1} width={"100%"}>
            <Grid item xs={1.3}>
              <Controller
                name="dtRef"
                rules={{ required: true }}
                control={control}
                render={({ field }) => (
                  <DatePicker label="Data de início" {...field} />
                )}
              />
            </Grid>

            <Grid item xs={2}>
              <AutocompleteLocationRelease label="Origem" name="locOrig" />
            </Grid>

            <Grid item xs={2}>
              <Controller
                name="demand"
                control={control}
                render={({ field }) => (
                  <TextField fullWidth label="Demanda" {...field} />
                )}
              />
            </Grid>

            <Grid item xs={2}>
              <Controller
                name="nickName"
                control={control}
                render={({ field }) => (
                  <AutocompleteDriver
                    {...field}
                    onChange={(value) => {
                      methods.setValue("nickName", value?.nickName);
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={2}>
              <Controller
                name="fleetCode"
                control={control}
                render={({ field }) => (
                  <AutocompleteFleetGroup
                    {...field}
                    onChange={(value) => {
                      methods.setValue("fleetCode", value?.description);
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={2}>
              <Controller
                name={"releaseStatus"}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    onChange={(value) => {
                      methods.setValue("releaseStatus", value?.target.value);
                    }}
                  >
                    <MenuItem value={"all"}>Todos</MenuItem>
                    <MenuItem value={"notReleased"}>Não liberado</MenuItem>
                    <MenuItem value={"released"}>Liberado</MenuItem>
                  </TextField>
                )}
              />
            </Grid>

            <Grid item xs={0.5} marginLeft={"auto"}>
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
