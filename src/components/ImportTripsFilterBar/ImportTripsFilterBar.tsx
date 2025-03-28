import { Button, Grid, styled } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Controller, FormProvider } from "react-hook-form";
import { GridSearchIcon } from "@mui/x-data-grid";
import { useImportTripsFilterBar } from "./useImportTripsFilterBar";
import { AutocompleteLocationGroup } from "../AutocompleteLocationGroup";

const CustomButton = styled(Button)(() => ({
  height: "40px",
}));

export function ImportTripsFilterBar(props: React.HTMLProps<HTMLFormElement>) {
  const { methods, onSubmit, onClearParams } = useImportTripsFilterBar();
  const { control, handleSubmit, setValue } = methods;

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
            <Grid item xs={3.2}>
              <AutocompleteLocationGroup
                name="locationCode"
                onChange={(value) => {
                  setValue("locationGroupCodeId", value?.id || "");
                  setValue("locationGroupCode", value?.code || "");
                }}
              />
            </Grid>

            <Grid item display={"flex"} xs={0.5} direction={"row"} gap={1}>
              <CustomButton
                size="large"
                variant="outlined"
                onClick={onClearParams}
              >
                Limpar
              </CustomButton>
              <CustomButton
                type="submit"
                size="large"
                variant="contained"
                color="primary"
              >
                <GridSearchIcon />
              </CustomButton>
            </Grid>
          </Grid>
        </form>
      </FormProvider>
    </LocalizationProvider>
  );
}
