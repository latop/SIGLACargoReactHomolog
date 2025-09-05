"use client";

import React from "react";
import { Controller, FormProvider } from "react-hook-form";
import { Button, Grid } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TextField, MenuItem } from "@mui/material";
import { useDeparturesArrivalsFilterBar } from "./useDeparturesArrivalsFilterBar";
import { AutocompleteLocationRelease } from "../AutocompleteLocationRelease";

export function DeparturesArrivalsFilterBar(
  props: React.HTMLProps<HTMLFormElement>,
) {
  const { methods, onSubmit } = useDeparturesArrivalsFilterBar();
  const { control, handleSubmit } = methods;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <FormProvider {...methods}>
        <form
          style={{ width: "100%", display: "flex" }}
          onSubmit={handleSubmit(onSubmit)}
          {...props}
        >
          <Grid container gap="16px" direction={"row"}>
            <Grid item xs={2} paddingLeft="0">
              <AutocompleteLocationRelease
                label="Cód. localização"
                name="locationCode"
              />
            </Grid>
            <Grid item xs={2} paddingLeft="0">
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
                    <MenuItem value="ARR">Chegadas</MenuItem>
                    <MenuItem value="DEP">Partidas</MenuItem>
                  </TextField>
                )}
              />
            </Grid>
          </Grid>
          <Grid item xs={0.9}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Buscar
            </Button>
          </Grid>
        </form>
      </FormProvider>
    </LocalizationProvider>
  );
}
