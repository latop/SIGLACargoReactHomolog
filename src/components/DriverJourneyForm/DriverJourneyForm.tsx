import React from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, Grid, Box, IconButton, colors, Icon } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@/components/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "dayjs/locale/pt-br";
import DeleteIcon from "@mui/icons-material/Delete";
import { TaskDriver } from "@/interfaces/schedule";
dayjs.extend(customParseFormat);

interface DriverJourneyFormProps {
  onDelete: () => void;
  defaultValues?: TaskDriver;
}

export const DriverJourneyForm = ({
  defaultValues,
  onDelete,
}: DriverJourneyFormProps) => {
  const { control, handleSubmit, watch } = useForm({
    defaultValues: defaultValues || {},
  });

  const onSubmit = () => {};

  const isTravel = watch("type") === "V";
  const isActivity = watch("type") === "A";

  const renderTravelFields = () => (
    <Grid container spacing={1.5}>
      <Grid item xs={3}>
        <Controller
          name="demand"
          control={control}
          render={({ field }) => (
            <TextField {...field} label="Demanda" fullWidth />
          )}
        />
      </Grid>
      <Grid item xs={3}>
        <Controller
          name="lineCode"
          control={control}
          render={({ field }) => (
            <TextField {...field} label="Cód. Rota" fullWidth />
          )}
        />
      </Grid>
      <Grid item xs={3}>
        <Controller
          name="locOrig"
          control={control}
          render={({ field }) => (
            <TextField {...field} label="Origem" fullWidth />
          )}
        />
      </Grid>
      <Grid item xs={3}>
        <Controller
          name="locDest"
          control={control}
          render={({ field }) => (
            <TextField {...field} label="Destino" fullWidth />
          )}
        />
      </Grid>
      <Grid item xs={3}>
        <Controller
          name="startPlanned"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <DateTimePicker
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
          name="endPlanned"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <DateTimePicker
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
        <Controller
          name="startActual"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <DateTimePicker
              label="Início realizado"
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
          name="endActual"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <DateTimePicker
              label="Fim realizado"
              error={error?.message}
              {...field}
              value={field.value ? dayjs(field.value) : null}
              onChange={(date) => field.onChange(date?.format())}
            />
          )}
        />
      </Grid>
    </Grid>
  );

  const renderActivityFields = () => (
    <Grid container spacing={1.5}>
      <Grid item xs={2}>
        <Controller
          name="activityCode"
          control={control}
          render={({ field }) => (
            <TextField {...field} label="Atividade" fullWidth />
          )}
        />
      </Grid>
      <Grid item xs={2.5}>
        <Controller
          name="startPlanned"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <DateTimePicker
              label="Início planejado"
              error={error?.message}
              {...field}
              value={field.value ? dayjs(field.value) : null}
              onChange={(date) => field.onChange(date?.format())}
            />
          )}
        />
      </Grid>
      <Grid item xs={2.5}>
        <Controller
          name="endPlanned"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <DateTimePicker
              label="Fim planejado"
              error={error?.message}
              {...field}
              value={field.value ? dayjs(field.value) : null}
              onChange={(date) => field.onChange(date?.format())}
            />
          )}
        />
      </Grid>
      <Grid item xs={2.5}>
        <Controller
          name="startActual"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <DateTimePicker
              label="Início realizado"
              error={error?.message}
              {...field}
              value={field.value ? dayjs(field.value) : null}
              onChange={(date) => field.onChange(date?.format())}
            />
          )}
        />
      </Grid>
      <Grid item xs={2.5}>
        <Controller
          name="endActual"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <DateTimePicker
              label="Fim realizado"
              error={error?.message}
              {...field}
              value={field.value ? dayjs(field.value) : null}
              onChange={(date) => field.onChange(date?.format())}
            />
          )}
        />
      </Grid>
    </Grid>
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box
          display={"flex"}
          flexDirection="column"
          gap="16px"
          padding="16px"
          bgcolor={colors.grey[100]}
          borderRadius="4px"
        >
          <Box display="flex" gap="10px" alignItems="center">
            {isTravel && renderTravelFields()}
            {isActivity && renderActivityFields()}
            <IconButton size="medium" onClick={onDelete}>
              <Icon component={DeleteIcon} fontSize="medium" />
            </IconButton>
          </Box>
        </Box>
      </form>
    </LocalizationProvider>
  );
};
