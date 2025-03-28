import { DateTimePicker } from "@/components/DatePicker";
import {
  Box,
  colors,
  Grid,
  Icon,
  IconButton,
  TextField,
  Tooltip,
} from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

import { AutocompleteDriver } from "@/components/AutocompleteDriver";
import { AutocompleteLocation } from "@/components/AutocompleteLocation";
import { AutocompleteStopType } from "@/components/AutocompleteStopType";
import DeleteIcon from "@mui/icons-material/Delete";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

interface Params {
  seq: number;
  id: string;
}
export const DailyTripSectionForm = ({ seq, id }: Params) => {
  const { control, setValue, getValues } = useFormContext();

  const insertMode =
    !id || id === "00000000-0000-0000-0000-000000000000" ? true : false;

  const handleDeleteStep = () => {
    const steps = getValues("dailyTripSections");
    steps.splice(seq, 1);
    setValue("dailyTripSections", steps);
  };

  const steps = getValues("dailyTripSections");

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <Box
        display={"flex"}
        padding="8px"
        bgcolor={colors.blue[50]}
        borderRadius="4px"
        boxShadow={2}
      >
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <h5>
              Seção {seq + 1} - {steps[seq].locationOrig.code}
            </h5>
          </Grid>
          <Grid item xs={2}>
            <Controller
              name={`dailyTripSections.${seq}.truck.licensePlate`}
              control={control}
              disabled={!insertMode}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  variant="outlined"
                  fullWidth
                  label="Placa"
                  error={!!error?.message}
                  helperText={error?.message?.toString()}
                />
              )}
            />
          </Grid>
          <Grid item xs={2}>
            <AutocompleteLocation
              name={`dailyTripSections.${seq}.locationOrig.code`}
              label="Origem"
            />
          </Grid>
          <Grid item xs={2}>
            <AutocompleteLocation
              name={`dailyTripSections.${seq}.locationDest.code`}
              label="Destino"
            />
          </Grid>
          <Grid item xs={2}>
            <AutocompleteStopType
              name={`dailyTripSections.${seq}.stopType.stopTypeCode`}
              label="Parada"
            />
          </Grid>
          <Grid item xs={4}>
            <AutocompleteDriver
              name={`dailyTripSections.${seq}.driverId`}
              disabled={!insertMode}
            />
          </Grid>

          <Grid item xs={2}>
            <Controller
              name={`dailyTripSections.${seq}.startPlanned`}
              control={control}
              render={({ field, fieldState: { error } }) => (
                <DateTimePicker
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
          <Grid item xs={2}>
            <Controller
              name={`dailyTripSections.${seq}.endPlanned`}
              control={control}
              render={({ field, fieldState: { error } }) => (
                <DateTimePicker
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
          <Grid item xs={2}>
            <Controller
              name={`dailyTripSections.${seq}.startEstimated`}
              control={control}
              disabled={!insertMode}
              render={({ field, fieldState: { error } }) => (
                <DateTimePicker
                  disabled={false}
                  label="Início estimado"
                  error={error?.message}
                  {...field}
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(date) => {
                    console.log("estimatedDate", date);
                    field.onChange(date?.format());
                    console.log("estimatedDate1", field.value);
                  }}
                />
              )}
            />
          </Grid>
          <Grid item xs={2}>
            <Controller
              name={`dailyTripSections.${seq}.endEstimated`}
              control={control}
              disabled={!insertMode}
              render={({ field, fieldState: { error } }) => (
                <DateTimePicker
                  disabled={false}
                  label="Fim estimado"
                  error={error?.message}
                  {...field}
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(date) => field.onChange(date?.format())}
                />
              )}
            />
          </Grid>
          <Grid item xs={2}>
            <Controller
              name={`dailyTripSections.${seq}.startActual`}
              control={control}
              disabled={!insertMode}
              render={({ field, fieldState: { error } }) => (
                <DateTimePicker
                  disabled={false}
                  label="Início Real"
                  error={error?.message}
                  {...field}
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(date) => field.onChange(date?.format())}
                />
              )}
            />
          </Grid>
          <Grid item xs={2}>
            <Controller
              name={`dailyTripSections.${seq}.endActual`}
              control={control}
              disabled={!insertMode}
              render={({ field, fieldState: { error } }) => (
                <DateTimePicker
                  disabled={false}
                  label="Fim Real"
                  error={error?.message}
                  {...field}
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(date) => field.onChange(date?.format())}
                />
              )}
            />
          </Grid>
        </Grid>
        <Box
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"flex-end"}
          alignItems={"center"}
        >
          <Tooltip title="Remover viagem" arrow>
            <IconButton size="small" onClick={handleDeleteStep}>
              <Icon component={DeleteIcon} fontSize="small" color="warning" />
            </IconButton>
          </Tooltip>
          {/* <Tooltip title="Horários Planejados" arrow>
            <IconButton size="small">
              <Icon
                component={AccessTimeIcon}
                fontSize="small"
                color="action"
              />
            </IconButton>
          </Tooltip>
          <Tooltip title="Justificativas" arrow>
            <IconButton size="small">
              <Icon
                component={ImageSearchOutlinedIcon}
                fontSize="small"
                color="action"
              />
            </IconButton>
          </Tooltip> */}
        </Box>
      </Box>
    </LocalizationProvider>
  );
};
