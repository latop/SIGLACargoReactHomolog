import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Box, Grid, colors, IconButton, Icon, Tooltip } from "@mui/material";
import { DatePicker } from "@/components/DatePicker";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import DeleteIcon from "@mui/icons-material/Delete";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "dayjs/locale/pt-br";
import { AutocompleteFleetGroup } from "@/components/AutocompleteFleetGroup";

dayjs.extend(customParseFormat);

export const DriverSectionFleets = ({ seq }: { seq: number }) => {
  const { control, setValue, getValues } = useFormContext();

  const handleDeleteStep = () => {
    const steps = getValues("driverFleets");
    steps.splice(seq, 1);
    setValue("driverFleets", steps);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <Box
        display={"flex"}
        padding="10px"
        bgcolor={colors.grey[100]}
        borderRadius="4px"
      >
        <Grid container spacing={1}>
          <Grid item xs={1.7}>
            <Controller
              name={`driverFleets.${seq}.startDate`}
              control={control}
              render={({ field, fieldState: { error } }) => (
                <DatePicker
                  disabled={false}
                  label="Início"
                  error={error?.message}
                  {...field}
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(date) => field.onChange(date)}
                />
              )}
            />
          </Grid>
          <Grid item xs={1.7}>
            <Controller
              name={`driverFleets.${seq}.endDate`}
              control={control}
              render={({ field, fieldState: { error } }) => (
                <DatePicker
                  disabled={false}
                  label="Fim"
                  error={error?.message}
                  {...field}
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(date) => field.onChange(date)}
                />
              )}
            />
          </Grid>

          <Grid item xs={1.7}>
            <AutocompleteFleetGroup
              keyCode="code"
              name={`driverFleets.${seq}.fleetGroup`}
              onChange={(value) => {
                setValue(`driverFleets.${seq}.fleetGroup`, value);
                setValue(`driverFleets.${seq}.fleetGroupId`, value?.id);
              }}
            />
          </Grid>
        </Grid>

        <Tooltip title="Remover viagem" arrow>
          <IconButton size="small" onClick={handleDeleteStep}>
            <Icon component={DeleteIcon} fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </LocalizationProvider>
  );
};
