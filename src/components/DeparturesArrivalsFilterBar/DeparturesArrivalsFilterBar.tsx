"use client";

import React from "react";
import { Controller, FormProvider } from "react-hook-form";
import { Button, Grid } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TextField, MenuItem } from "@mui/material";
import { useDeparturesArrivalsFilterBar } from "./useDeparturesArrivalsFilterBar";

export function DeparturesArrivalsFilterBar(
  props: React.HTMLProps<HTMLFormElement>,
) {
  const { methods, onSubmit } = useDeparturesArrivalsFilterBar();
  const { control, handleSubmit } = methods;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} {...props}>
          <Grid
            container
            alignItems="flex-start"
            margin="26px auto 10px"
            width="1080px"
            gap="16px"
          >
            <Grid item xs={3} paddingLeft="0">
              <Controller
                name="locationCode"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    variant="outlined"
                    fullWidth
                    label="Cód. localização"
                    error={!!error?.message}
                    helperText={error?.message?.toString()}
                  />
                )}
              />
            </Grid>
            <Grid item xs={3} paddingLeft="0">
              <Controller
                name="direction"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    variant="outlined"
                    fullWidth
                    label="Direção"
                    select
                    error={!!error?.message}
                    helperText={error?.message?.toString()}
                  >
                    <MenuItem value="ARR">ARR</MenuItem>
                    <MenuItem value="DEP">DEP</MenuItem>
                  </TextField>
                )}
              />
            </Grid>

            <Grid item xs={0.9}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Buscar
              </Button>
            </Grid>
          </Grid>
        </form>
      </FormProvider>
    </LocalizationProvider>
  );
}
