import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Box, TextField, Grid, colors } from "@mui/material";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "dayjs/locale/pt-br";

dayjs.extend(customParseFormat);

const daysOfWeek = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

export const ScenarioSectionForm = ({ seq }: { seq: number }) => {
  const { control } = useFormContext();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <Box
        display={"flex"}
        flexDirection="column"
        padding="10px"
        bgcolor={colors.grey[100]}
        borderRadius="4px"
      >
        <Grid container spacing={1}>
          <Grid item xs={1.5}>
            <Controller
              name={`scenarioCapacities.${seq}.line.code`}
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  variant="outlined"
                  fullWidth
                  label="Cód. Linha"
                  error={!!error?.message}
                  helperText={error?.message?.toString()}
                />
              )}
            />
          </Grid>
          {daysOfWeek.map((day, index) => (
            <>
              <Grid item xs={0.6} key={day}>
                <Controller
                  name={`scenarioCapacities.${seq}.${day}`}
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      variant="outlined"
                      fullWidth
                      label={dayjs()
                        .locale("pt-br")
                        .day(index + 1)
                        .format("ddd")} // Capitalize the first letter
                      error={!!error?.message}
                      helperText={error?.message?.toString()}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={0.9} key={day}>
                <Controller
                  name={`scenarioCapacities.${seq}.startTime${
                    day.charAt(0).toUpperCase() + day.slice(1)
                  }`}
                  control={control}
                  render={({ field }) => (
                    <TimePicker
                      {...field}
                      disableOpenPicker
                      slotProps={{}}
                      value={field.value ? dayjs(field.value) : null}
                      onChange={(date) => field.onChange(date?.format())}
                      label={`Hora ${dayjs()
                        .locale("pt-br")
                        .day(index + 1)
                        .format("ddd")}`}
                    />
                  )}
                />
              </Grid>
            </>
          ))}
        </Grid>
      </Box>
    </LocalizationProvider>
  );
};
