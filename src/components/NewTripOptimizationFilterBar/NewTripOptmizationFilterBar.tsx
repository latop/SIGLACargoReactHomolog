"use client";

import { Button, Grid } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Controller, FormProvider } from "react-hook-form";
import { useNewTripOptmizationFilterBar } from "./useNewTripOptmizationFilterBar";
import { AutocompleteLocationGroup } from "../AutocompleteLocationGroup";
import { useState } from "react";

import SearchIcon from "@mui/icons-material/Search";
import SettingsIcon from "@mui/icons-material/Settings";
import RefreshIcon from "@mui/icons-material/Refresh";

export function NewTripOptmizationFilterBar() {
  const { methods, onSubmit } = useNewTripOptmizationFilterBar();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const { control, handleSubmit } = methods;

  //TODO: Implementar a lógica de atualização
  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // Add your success handling here
    } catch (error) {
      // Add your error handling here
      console.error("Update failed:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  //TODO: Implementar a lógica de otimização
  const handleOptimize = async () => {
    setIsOptimizing(true);
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // Add your success handling here
    } catch (error) {
      // Add your error handling here
      console.error("Optimization failed:", error);
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <FormProvider {...methods}>
        <form style={{ width: "100%" }} onSubmit={handleSubmit(onSubmit)}>
          <Grid container alignItems="flex-start" spacing={1}>
            <Grid item xs={1.5}>
              <Controller
                name="start"
                rules={{ required: true }}
                control={control}
                render={({ field }) => <DatePicker label="Início" {...field} />}
              />
            </Grid>
            <Grid item xs={1.5}>
              <Controller
                name="end"
                rules={{ required: true }}
                control={control}
                render={({ field }) => <DatePicker label="Fim" {...field} />}
              />
            </Grid>
            <Grid item xs={2}>
              <AutocompleteLocationGroup
                name="locationGroupCode"
                label="Cód. Loc"
                onChange={(value) => {
                  methods.setValue("locationGroupCode", value?.code as string);
                }}
              />
            </Grid>
            <Grid item xs={4} display="flex" gap="4px">
              <Button
                size="large"
                variant="contained"
                color="primary"
                type="submit"
              >
                <SearchIcon />
              </Button>
              {/* TODO: Implementar a lógica de otimização */}
              <Button
                size="large"
                variant="contained"
                color="primary"
                onClick={handleOptimize}
                disabled={isOptimizing}
              >
                {isOptimizing ? "Otimizando..." : "Otimizar"}
                <SettingsIcon fontSize="inherit" sx={{ ml: "5px" }} />
              </Button>
              <Button
                onClick={handleUpdate}
                size="large"
                variant="contained"
                color="primary"
                disabled={isUpdating}
              >
                {isUpdating ? "Atualizando..." : "Atualizar"}
                <RefreshIcon fontSize="inherit" sx={{ ml: "5px" }} />
              </Button>
            </Grid>
          </Grid>
        </form>
      </FormProvider>
    </LocalizationProvider>
  );
}
