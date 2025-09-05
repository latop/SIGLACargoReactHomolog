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
import { AutocompleteLocationGroup } from "@/components/AutocompleteLocationGroup";

dayjs.extend(customParseFormat);

export const DriverSectionBases = ({ seq }: { seq: number }) => {
  const { control, setValue, getValues } = useFormContext();

  const handleDeleteStep = () => {
    const steps = getValues("driverBases");
    steps.splice(seq, 1);
    setValue("driverBases", steps);
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
              name={`driverBases.${seq}.startDate`}
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
              name={`driverBases.${seq}.endDate`}
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
            <AutocompleteLocationGroup
              name={`driverBases.${seq}.locationGroup.code`}
              onChange={(value) => {
                setValue(`driverBases.${seq}.locationGroup`, value);
                setValue(`driverBases.${seq}.locationGroupId`, value?.id);
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
