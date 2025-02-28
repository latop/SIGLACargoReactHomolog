"use client";

import React from "react";
import dayjs from "dayjs";
import { Controller, FormProvider } from "react-hook-form";
import { Button, Grid } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@/components/DatePicker";
import { TextField, MenuItem } from "@mui/material";
import { useDailyTripsFilterBar } from "./useDailyTripsFilterBar";
import SearchIcon from "@mui/icons-material/Search";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "dayjs/locale/pt-br";
import { AutocompleteFleetGroup } from "../AutocompleteFleetGroup";
import { AutocompleteLocation } from "../AutocompleteLocation";
import { FleetGroup } from "@/interfaces/vehicle";

dayjs.extend(customParseFormat);

export function DailyTripsFilterBar(props: React.HTMLProps<HTMLFormElement>) {
  const { methods, onSubmit } = useDailyTripsFilterBar();
  const { control, handleSubmit, setValue } = methods;

  const handleChangeFleetGroup = (value: FleetGroup | null) => {
    setValue("fleetGroupId", value?.id || "");
    setValue("fleetGroupCode", value?.code || "");
  };
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} {...props}>
          <Grid
            container
            alignItems="center"
            justifyContent="center"
            width="100%"
            gap="16px"
          >
            <Grid item xs={1.6}>
              <Controller
                name="tripDate"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    label="Data da viagem"
                    error={error?.message}
                    {...field}
                  />
                )}
              />
            </Grid>

            <Grid item xs={2} paddingLeft="0">
              <AutocompleteFleetGroup onChange={handleChangeFleetGroup} />
            </Grid>
            <Grid item xs={1.6} paddingLeft="0">
              <Controller
                name="sto"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    variant="outlined"
                    fullWidth
                    label="STO"
                    error={!!error?.message}
                    helperText={error?.message?.toString()}
                  />
                )}
              />
            </Grid>
            <Grid item xs={1.7} paddingLeft="0">
              <AutocompleteLocation
                name="locationOrigId"
                label="Origem"
                keyCode="id"
              />
            </Grid>
            <Grid item xs={1.6} paddingLeft="0">
              <AutocompleteLocation
                name="locationDestId"
                label="Destino"
                keyCode="id"
              />
            </Grid>
            <Grid item xs={1.6} paddingLeft="0">
              <Controller
                name="flgStatus"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    variant="outlined"
                    fullWidth
                    label="Status"
                    select
                    error={!!error?.message}
                    helperText={error?.message?.toString()}
                  >
                    <MenuItem value="C">Cancelado</MenuItem>
                    <MenuItem value="N">Ativo</MenuItem>
                  </TextField>
                )}
              />
            </Grid>

            <Grid item xs={1}>
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
