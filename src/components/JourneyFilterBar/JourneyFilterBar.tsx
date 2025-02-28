import React from "react";
import { Controller, FormProvider } from "react-hook-form";
import dayjs from "dayjs";
import { Button, Grid, TextField } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@/components/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { AutocompleteDriver } from "@/components/AutocompleteDriver";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { AutocompleteLocationGroup } from "@/components/AutocompleteLocationGroup";
import { AutocompleteFleetGroup } from "@/components/AutocompleteFleetGroup";
import { AutocompleteLocation } from "@/components/AutocompleteLocation";
import { AutocompletePosition } from "@/components/AutocompletePosition";
import { useJourneyFilterBar } from "./useJourneyFilterBar";
import { AutocompleteActivity } from "../AutocompleteActivity";
import SearchIcon from "@mui/icons-material/Search";
import "dayjs/locale/pt-br";

dayjs.extend(customParseFormat);

export function JourneyFilterBar(props: React.HTMLProps<HTMLFormElement>) {
  const { methods, onSubmit } = useJourneyFilterBar();
  const { control, handleSubmit, watch } = methods;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} {...props}>
          <Grid
            container
            alignItems="flex-start"
            justifyContent="space-between"
            padding="20px 20px 0"
          >
            <Grid item xs={1.2}>
              <Controller
                name="startDate"
                rules={{ required: true }}
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    label="Data de início"
                    error={error?.message}
                    {...field}
                  />
                )}
              />
            </Grid>
            <Grid item xs={1.2}>
              <Controller
                name="endDate"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    label="Data de fim"
                    error={error?.message}
                    minDate={dayjs(watch("startDate"))}
                    {...field}
                  />
                )}
              />
            </Grid>

            <Grid item xs={1.1}>
              <AutocompleteDriver />
            </Grid>

            <Grid item xs={1.1}>
              <Controller
                name="demandAttrib"
                control={control}
                render={({ field }) => (
                  <TextField fullWidth label="Demanda" {...field} />
                )}
              />
            </Grid>

            <Grid item xs={1.1}>
              <AutocompleteLocation name="locationOrigCode" label="Origem" />
            </Grid>

            <Grid item xs={1.1}>
              <AutocompleteLocation name="locationDestCode" label="Destino" />
            </Grid>

            <Grid item xs={1.1}>
              <AutocompleteActivity />
            </Grid>

            <Grid item xs={1.1}>
              <AutocompleteFleetGroup />
            </Grid>

            <Grid item xs={1.1}>
              <AutocompleteLocationGroup />
            </Grid>

            <Grid item xs={1.1}>
              <AutocompletePosition />
            </Grid>

            <Grid item xs={0.5}>
              <Button
                type="submit"
                size="large"
                variant="contained"
                color="primary"
                fullWidth
              >
                <SearchIcon />
              </Button>
            </Grid>
          </Grid>
        </form>
      </FormProvider>
    </LocalizationProvider>
  );
}
