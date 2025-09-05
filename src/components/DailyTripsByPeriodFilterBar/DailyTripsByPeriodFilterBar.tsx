"use client";

import React from "react";
import { Controller, FormProvider } from "react-hook-form";
import dayjs from "dayjs";
import { Box, Button, Grid } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@/components/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { AutocompleteFleetGroup } from "@/components/AutocompleteFleetGroup";
import { useDailyTripsByPeriodFilterBar } from "./useDailyTripsByPeriodFilterBar";
import SearchIcon from "@mui/icons-material/Search";
import "dayjs/locale/pt-br";
import { AutocompleteLocationGroup } from "../AutocompleteLocationGroup";
import { AutocompleteTruck } from "../AutocompleteTruck";

dayjs.extend(customParseFormat);

export function DailyTripsByPeriodFilterBar(
  props: React.HTMLProps<HTMLFormElement>,
) {
  const { methods, onSubmit, onClearParams } = useDailyTripsByPeriodFilterBar();
  const { control, handleSubmit, watch } = methods;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <FormProvider {...methods}>
        <Box display={"flex"}>
          <form onSubmit={handleSubmit(onSubmit)} {...props}>
            <Grid container gap="16px" direction={"row"}>
              <Grid container alignItems="flex-start" gap="16px">
                <Grid xs={2} item>
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
                <Grid xs={2} item>
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
                <Grid xs={2} item>
                  <AutocompleteFleetGroup />
                </Grid>
                <Grid xs={2} item>
                  <AutocompleteLocationGroup />
                </Grid>
                <Grid xs={2} item>
                  <AutocompleteTruck
                    onChange={(value) => {
                      methods.setValue("licensePlate", value?.licensePlate);
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </form>
          <Box display="flex" maxWidth={"200px"} width={"100%"} gap={1}>
            <Button color="primary" onClick={onClearParams} variant="outlined">
              Limpar
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              onClick={handleSubmit(onSubmit)}
            >
              <SearchIcon />
            </Button>
          </Box>
        </Box>
      </FormProvider>
    </LocalizationProvider>
  );
}
