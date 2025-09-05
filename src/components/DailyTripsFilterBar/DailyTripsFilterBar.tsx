"use client";

import { AutocompleteCompany } from "@/components/AutocompleteCompany";
import { AutocompleteDriver } from "@/components/AutocompleteDriver";
import { AutocompleteFleetGroup } from "@/components/AutocompleteFleetGroup";
import { AutocompleteLocation } from "@/components/AutocompleteLocation";
import { AutocompleteTripType } from "@/components/AutocompleteTripType";
import { AutocompleteTruck } from "@/components/AutocompleteTruck";
import { DatePicker } from "@/components/DatePicker";
import {
  CollapseButton,
  FiltersCollapsable,
  useFiltersCollapse,
} from "@/components/FiltersCollapsable";
import SearchIcon from "@mui/icons-material/Search";
import { Box, Button, Grid, MenuItem, TextField } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { Controller, FormProvider } from "react-hook-form";
import { useDailyTripsFilterBar } from "./useDailyTripsFilterBar";

dayjs.extend(customParseFormat);

export function DailyTripsFilterBar() {
  const { methods, onSubmit, onClearParams } = useDailyTripsFilterBar();
  const { showMoreFilters, toggleMoreFilters } =
    useFiltersCollapse("daily-trips-filter");
  const { control, handleSubmit } = methods;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container alignItems="flex-start" width="100%" gap={0.5}>
            <Grid item xs={1.5}>
              <Controller
                name="tripDate"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    label="Data da viagem *"
                    error={error?.message}
                    {...field}
                    value={field.value ? dayjs(field.value) : undefined}
                  />
                )}
              />
            </Grid>
            <Grid item xs={1.5}>
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
            <Grid item xs={1.5}>
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
                    <MenuItem value="N">Ativo</MenuItem>
                    <MenuItem value="C">Cancelado</MenuItem>
                  </TextField>
                )}
              />
            </Grid>
            <Grid item xs={1.5}>
              <AutocompleteDriver
                onChange={(value) => {
                  methods.setValue("nickName", value?.nickName);
                }}
              />
            </Grid>
            <Grid item xs={1.5}>
              <AutocompleteTruck
                onChange={(value) => {
                  methods.setValue("licensePlate", value?.licensePlate);
                }}
              />
            </Grid>

            <Grid item xs={1}>
              <Button
                type="reset"
                size="large"
                variant="outlined"
                color="primary"
                fullWidth
                onClick={onClearParams}
              >
                Limpar
              </Button>
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
            <Grid item xs={1.5}>
              <CollapseButton
                isOpen={showMoreFilters}
                onClick={toggleMoreFilters}
              />
            </Grid>
          </Grid>
          <Box pt={1}>
            <FiltersCollapsable isOpen={showMoreFilters}>
              <Grid item xs={1.5}>
                <AutocompleteFleetGroup />
              </Grid>
              <Grid item xs={1.5}>
                <AutocompleteLocation
                  name="locationOrigId"
                  label="Origem"
                  keyCode="id"
                />
              </Grid>
              <Grid item xs={1.5}>
                <AutocompleteLocation
                  //       ref={locationOrigRef}
                  name="locationDestId"
                  label="Destino"
                  keyCode="id"
                />
              </Grid>
              <Grid item xs={1.5}>
                <AutocompleteTripType
                  name="tripTypeId"
                  label="Tipo da viagem"
                  keyCode="id"
                />
              </Grid>
              <Grid item xs={1.5}>
                <AutocompleteCompany />
              </Grid>
            </FiltersCollapsable>
          </Box>
        </form>
      </FormProvider>
    </LocalizationProvider>
  );
}
