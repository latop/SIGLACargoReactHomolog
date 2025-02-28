import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Box, Grid } from "@mui/material";
import { DatePicker } from "@/components/DatePicker";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "dayjs/locale/pt-br";
import { AutocompleteFleetGroup } from "@/components/AutocompleteFleetGroup";
import { AutocompleteLocationGroup } from "@/components/AutocompleteLocationGroup";

dayjs.extend(customParseFormat);

export const GenerateVehiclePlanningForm = () => {
  const { control, setValue } = useFormContext();
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <Box display="flex" flexDirection="column" gap="20px" mt="5px">
        <Box display="flex" gap="20px">
          <Grid container spacing={1}>
            <Grid item xs={3}>
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
            <Grid item xs={3}>
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
            <Grid item xs={3}>
              <AutocompleteLocationGroup />
            </Grid>
            <Grid item xs={3}>
              <AutocompleteFleetGroup
                name="fleetGroupCode"
                onChange={(value) => {
                  setValue("fleetGroupCode", value?.code);
                }}
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};
