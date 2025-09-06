import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Box, TextField, Typography, colors, Chip, Grid } from "@mui/material";
import { DateTimePicker } from "@/components/DatePicker";

import styled from "@emotion/styled";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { DriverJourneyForm } from "../../../DriverJourneyForm";
import { useToast } from "@/hooks/useToast";
import { TaskDriver } from "@/interfaces/schedule";
import "dayjs/locale/pt-br";
import { AutocompleteDriver } from "@/components/AutocompleteDriver";

dayjs.extend(customParseFormat);

const TextArea = styled(TextField)`
  && {
    height: 100%;

    .MuiInputBase-root,
    textarea {
      height: 100% !important;
    }
  }
`;

export const JourneyForm = () => {
  const { addToast } = useToast();
  const { watch, control, setValue } = useFormContext();
  const tasksDriver = watch("tasksDriver");

  const handleDeleteDriverSchedule = (index: number) => {
    tasksDriver.splice(index, 1);
    setValue("tasksDriver", tasksDriver);
    addToast("Viagem removida com sucesso");
  };

  const countJourneys = tasksDriver?.length;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <Box display="flex" flexDirection="column" gap="20px" mt="5px">
        <Box display="flex" gap="20px">
          <Grid container spacing={2} columns={12}>
            <Grid item xs={2}>
              <AutocompleteDriver />
            </Grid>
            <Grid item xs={2}>
              <Controller
                name={`otmProcess`}
                control={control}
                disabled
                render={({ field }) => (
                  <TextField {...field} label="Circuito" fullWidth />
                )}
              />
            </Grid>
            <Grid item xs={1.5}>
              <Controller
                name="startDate"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DateTimePicker
                    disabled
                    disableOpenPicker
                    label="Início planejado"
                    error={error?.message}
                    {...field}
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(date) => field.onChange(date?.format())}
                  />
                )}
              />
            </Grid>
            <Grid item xs={1.5}>
              <Controller
                name="endDate"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DateTimePicker
                    disableOpenPicker
                    disabled
                    label="Fim planejado"
                    error={error?.message}
                    {...field}
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(date) => field.onChange(date?.format())}
                  />
                )}
              />
            </Grid>
            <Grid item xs={5}>
              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <TextArea
                    {...field}
                    disabled={false}
                    label="Observações"
                    variant="outlined"
                    fullWidth
                    maxRows={3}
                  />
                )}
              />
            </Grid>
          </Grid>
        </Box>
        <Box gap="10px" display="flex" flexDirection="column">
          <Box display="flex" alignItems="center" gap="8px">
            <Typography variant="subtitle2">Jornadas do motorista</Typography>
            {countJourneys > 0 && (
              <Chip label={countJourneys} color="default" size="small" />
            )}
          </Box>
          {tasksDriver?.length === 0 && (
            <Box display="flex">
              <Typography variant="body2" color={colors.grey[700]}>
                Não há jornadas para este motorista, adicione uma nova jornada.
              </Typography>
            </Box>
          )}

          <Box gap="16px" display="flex" flexDirection="column">
            {tasksDriver?.map((taskDriver: TaskDriver, index: number) => (
              <DriverJourneyForm
                onDelete={() => handleDeleteDriverSchedule(index)}
                key={taskDriver.idTask}
                seq={index}
              />
            ))}
          </Box>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};
