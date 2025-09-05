import { DatePicker, DateTimePicker } from "@/components/DatePicker";
import {
  Box,
  Chip,
  colors,
  Grid,
  MenuItem,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

import { AutocompleteCompany } from "@/components/AutocompleteCompany";
import { AutocompleteFleetGroup } from "@/components/AutocompleteFleetGroup";
import { AutocompleteLine } from "@/components/AutocompleteLine";
import { AutocompleteLocation } from "@/components/AutocompleteLocation";
import { AutocompleteTripType } from "@/components/AutocompleteTripType";
import { DailyTrip } from "@/interfaces/daily-trip";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { DailyTripSectionForm } from "./DailyTripSectionForm";
import { AutocompleteJustification } from "@/components/AutocompleteJustification";
const TextArea = styled(TextField)`
  && {
    height: 100%;

    .MuiInputBase-root,
    textarea {
      height: 100% !important;
    }
  }
`;

dayjs.extend(customParseFormat);

export const DailyTripForm = () => {
  const { control, watch, setValue } = useFormContext();
  const dailyTripSections = watch("dailyTripSections");

  const countSections = dailyTripSections?.length;
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <Box display="flex" flexDirection="column" gap="20px" mt="5px">
        <Box display="flex" gap="20px">
          <Grid container spacing={1}>
            <Grid item xs={2}>
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
                    helperText={error?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={2}>
              <Controller
                name="tripDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Data da viagem"
                    format="DD/MM/YYYY"
                    {...field}
                    slotProps={{
                      textField: {
                        required: true,
                      },
                    }}
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(date) => field.onChange(date?.format())}
                  />
                )}
              />
            </Grid>

            {/* <Grid item xs={4}>
              Açoes
            </Grid> */}

            <Grid item xs={2}>
              <AutocompleteLine
                name="line.code"
                isRequired
                onChange={(value) => {
                  setValue("lineId", value?.id);
                  setValue("line", value);
                }}
              />
            </Grid>
            <Grid item xs={2}>
              <AutocompleteTripType name="tripType.code" isRequired />
            </Grid>
            <Grid item xs={2}>
              <AutocompleteCompany name="company.name" />
            </Grid>
            <Grid item xs={2}>
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
            <Grid item xs={2}>
              <AutocompleteLocation
                name="locationOrig.code"
                label="Origem"
                isRequired
              />
            </Grid>
            <Grid item xs={2}>
              <AutocompleteLocation
                name="locationDest.code"
                label="Destino"
                isRequired
              />
            </Grid>
            <Grid item xs={2}>
              <Controller
                name="startPlanned"
                control={control}
                disabled
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
                name="endPlanned"
                disabled
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
                name="startActual"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DateTimePicker
                    disabled={false}
                    label="Início executado"
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
                name="endActual"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DateTimePicker
                    disabled={false}
                    label="Fim executado"
                    error={error?.message}
                    {...field}
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(date) => field.onChange(date?.format())}
                  />
                )}
              />
            </Grid>

            <Grid item xs={2}>
              <AutocompleteFleetGroup name="fleetGroup.code" isRequired />
            </Grid>
            <Grid item xs={4}>
              <AutocompleteJustification
                hasSkeleton
                name="justification.description"
                keyCode="description"
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="notes"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextArea
                    {...field}
                    disabled={false}
                    label="Observações"
                    variant="outlined"
                    error={!!error?.message}
                    fullWidth
                    maxRows={3}
                  />
                )}
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Box gap="10px" display="flex" flexDirection="column" mt={3}>
        <Box display="flex" alignItems="center" gap="8px">
          <Typography variant="subtitle2">Seções da viagem</Typography>
          {countSections > 0 && (
            <Chip label={countSections} color="default" size="small" />
          )}
        </Box>
        {dailyTripSections?.length === 0 && (
          <Box display="flex">
            <Typography variant="body2" color={colors.grey[700]}>
              Não há seções para essa viagem.
            </Typography>
          </Box>
        )}

        <Box gap="8px" display="flex" flexDirection="column">
          {dailyTripSections?.map((dailytrip: DailyTrip, index: number) => (
            <DailyTripSectionForm
              key={dailytrip.id}
              seq={index}
              id={dailytrip.id}
            />
          ))}
        </Box>
      </Box>
    </LocalizationProvider>
  );
};
