import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import {
  Box,
  colors,
  TextField,
  Chip,
  Grid,
  FormControlLabel,
  Switch,
  Typography,
} from "@mui/material";
import { DateTimePicker } from "@/components/DatePicker";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "dayjs/locale/pt-br";
import { ScenarioSectionForm } from "../ScenarioSectionForm";
import { Scenario } from "@/interfaces/planning";

dayjs.extend(customParseFormat);

export const ScenarioForm = () => {
  const { control, watch } = useFormContext();
  const scenarioCapacities = watch("scenarioCapacities");

  const countSections = scenarioCapacities?.length;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <Box display="flex" flexDirection="column" gap="20px" mt="5px">
        <Box display="flex" gap="20px">
          <Grid container spacing={2}>
            <Grid item xs={2}>
              <Controller
                name={`code`}
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Código" fullWidth />
                )}
              />
            </Grid>
            <Grid item xs={3}>
              <Controller
                name={`description`}
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Descrição" fullWidth />
                )}
              />
            </Grid>
            <Grid item xs={1.7}>
              <Controller
                name="startDate"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DateTimePicker
                    disabled={false}
                    label="Data de inicio"
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
                  <DateTimePicker
                    disabled={false}
                    label="Data de fim"
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
                name="isDated"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Switch {...field} checked={field.value} />}
                    label="Em vigência"
                  />
                )}
              />
            </Grid>
            <Grid item xs={1.5}>
              <Controller
                name="isDefault"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Switch {...field} checked={field.value} />}
                    label="Padrão"
                  />
                )}
              />
            </Grid>
          </Grid>
        </Box>
        <Box gap="10px" display="flex" flexDirection="column">
          <Box display="flex" alignItems="center" gap="8px">
            <Typography variant="subtitle2">Linhas da viagem</Typography>
            {countSections > 0 && (
              <Chip label={countSections} color="default" size="small" />
            )}
          </Box>
          {scenarioCapacities?.length === 0 && (
            <Box display="flex">
              <Typography variant="body2" color={colors.grey[700]}>
                Não há linhas para essa viagem.
              </Typography>
            </Box>
          )}

          <Box gap="16px" display="flex" flexDirection="column">
            {scenarioCapacities?.map((_: Scenario, index: number) => (
              <ScenarioSectionForm key={index} seq={index} />
            ))}
          </Box>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};
