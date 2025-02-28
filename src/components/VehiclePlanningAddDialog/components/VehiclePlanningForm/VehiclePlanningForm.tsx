import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import {
  Box,
  Grid,
  FormControlLabel,
  Checkbox,
  TextField,
} from "@mui/material";
import { DatePicker } from "@/components/DatePicker";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "dayjs/locale/pt-br";
import { AutocompleteDriver } from "@/components/AutocompleteDriver";
import { AutocompleteTruck } from "@/components/AutocompleteTruck";
import { TimePicker } from "@mui/x-date-pickers";

dayjs.extend(customParseFormat);

const daysOfWeek = [
  { field: "freqMon", headerName: "Seg" },
  { field: "freqTue", headerName: "Ter" },
  { field: "freqWed", headerName: "Qua" },
  { field: "freqThu", headerName: "Qui" },
  { field: "freqFri", headerName: "Sex" },
  { field: "freqSat", headerName: "Sáb" },
  { field: "freqSun", headerName: "Dom" },
];

export const VehiclePlanningForm = () => {
  const { control, setValue, watch } = useFormContext();
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <Box display="flex" flexDirection="column" gap="20px" mt="5px">
        <Box display="flex" gap="20px">
          <Grid container spacing={1}>
            <Grid item xs={1.7}>
              <AutocompleteTruck
                onChange={(value) => {
                  setValue("truck", value);
                }}
              />
            </Grid>
            <Grid item xs={1.7}>
              <Controller
                name="truck.locationGroup.code"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    variant="outlined"
                    fullWidth
                    label="Base do veículo"
                    InputLabelProps={{ shrink: true }}
                    value={watch("truck")?.locationGroup?.code}
                    disabled
                  />
                )}
              />
            </Grid>
            <Grid item xs={1.7}>
              <Controller
                name="truck.fleetType.fleetGroup.code"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    variant="outlined"
                    fullWidth
                    value={watch("truck")?.fleetType?.fleetGroup?.code}
                    InputLabelProps={{ shrink: true }}
                    label="Grupo de frota"
                    disabled
                  />
                )}
              />
            </Grid>
            <Grid item xs={1.7}>
              <Controller
                name="startDate"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    disabled={false}
                    label="Início planejado"
                    error={error?.message}
                    {...field}
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(date) => field.onChange(date?.format())}
                  />
                )}
              />
            </Grid>
            <Grid item xs={1.7}>
              <Controller
                name="endDate"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    disabled={false}
                    label="Fim planejado"
                    error={error?.message}
                    {...field}
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(date) => field.onChange(date?.format())}
                  />
                )}
              />
            </Grid>
          </Grid>
        </Box>
        <Box display="flex" gap="20px">
          <Grid container spacing={1}>
            <Grid item xs={1.7}>
              <AutocompleteDriver
                name="driver.nickName"
                onChange={(value) => {
                  setValue("driver", value);
                }}
              />
            </Grid>
            <Grid item xs={1.7}>
              <Controller
                name="startTime"
                control={control}
                render={({ field }) => (
                  <TimePicker
                    disabled={false}
                    label="Hora de início"
                    {...field}
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(date) => field.onChange(date?.format())}
                  />
                )}
              />
            </Grid>
            <Grid item xs={1.7}>
              <Controller
                name="endTime"
                control={control}
                render={({ field }) => (
                  <TimePicker
                    disabled={false}
                    label="Hora de fim"
                    {...field}
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(date) => field.onChange(date?.format())}
                  />
                )}
              />
            </Grid>
            {daysOfWeek.map((day) => (
              <Grid
                display="flex"
                justifyContent="center"
                ml="20px"
                item
                xs={0.6}
                key={day.field}
              >
                <Controller
                  name={day.field}
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      componentsProps={{
                        typography: {
                          variant: "body2",
                        },
                      }}
                      control={
                        <Checkbox
                          size="small"
                          {...field}
                          checked={field.value}
                        />
                      }
                      label={day.headerName}
                    />
                  )}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};
