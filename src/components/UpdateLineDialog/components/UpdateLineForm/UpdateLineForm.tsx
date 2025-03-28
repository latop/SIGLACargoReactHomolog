import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import {
  Box,
  TextField,
  Grid,
  FormControlLabel,
  Checkbox,
  Typography,
  Chip,
  colors,
} from "@mui/material";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "dayjs/locale/pt-br";
import { AutocompleteFleetGroup } from "@/components/AutocompleteFleetGroup";
import { AutocompleteLocation } from "@/components/AutocompleteLocation";
import { AutocompleteTripType } from "@/components/AutocompleteTripType";
import { DatePicker } from "@mui/x-date-pickers";
import { UpdateLineSectionForm } from "../UpdateLineSectionForm";

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

export const UpdateLineForm = () => {
  const { control, watch, setValue } = useFormContext();
  const lineSections = watch("lineSections");

  const countSections = lineSections?.length;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <Box display="flex" flexDirection="column" gap="12px" mt="5px">
        <Box display="flex" gap="20px">
          <Grid container spacing={1}>
            <Grid item xs={2}>
              <Controller
                name="line.code"
                control={control}
                render={({ field, fieldState: { error } }) => {
                  return (
                    <TextField
                      {...field}
                      value={field?.value?.toUpperCase() || ""}
                      variant="outlined"
                      fullWidth
                      label="Código"
                      error={!!error?.message}
                      helperText={error?.message?.toString()}
                    />
                  );
                }}
              />
            </Grid>
            <Grid item xs={8}>
              <Controller
                name="line.description"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    value={field.value?.toUpperCase() || ""}
                    variant="outlined"
                    fullWidth
                    label="Descrição"
                    error={!!error?.message}
                    helperText={error?.message?.toString()}
                  />
                )}
              />
            </Grid>
          </Grid>
        </Box>
        <Box display="flex" gap="20px">
          <Grid container spacing={1} width={"100%"}>
            <Grid item xs={2}>
              <Controller
                name="line.startDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    disabled={false}
                    sx={{ width: "100%" }}
                    label="Início"
                    {...field}
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(date) => field.onChange(date?.format())}
                  />
                )}
              />
            </Grid>
            <Grid item xs={2}>
              <Controller
                name="line.endDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    disabled={false}
                    label="Fim"
                    sx={{ width: "100%" }}
                    {...field}
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(date) => field.onChange(date?.format())}
                    slotProps={{
                      textField: {
                        error: false,
                      },
                    }}
                  />
                )}
              />
            </Grid>
            {daysOfWeek.map((day) => (
              <Grid
                display="flex"
                justifyContent="center"
                xs={0.295}
                item
                key={day.field}
              >
                <Controller
                  name={`line.${day.field}`}
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      componentsProps={{
                        typography: {
                          variant: "body2",
                        },
                      }}
                      sx={{
                        display: "flex",
                        flexDirection: "column-reverse",
                        margin: "0",
                      }}
                      control={
                        <Checkbox
                          size="small"
                          sx={{
                            padding: "0",
                          }}
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
            <Grid item xs={1}>
              <Controller
                name="line.overtimeAllowed"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    variant="outlined"
                    fullWidth
                    label="Aprov Hr Extra"
                    error={!!error?.message}
                    helperText={error?.message?.toString()}
                    onChange={(e) => {
                      field.onChange(Number(e.target.value));
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={1}>
              <Controller
                name="line.cost"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    variant="outlined"
                    fullWidth
                    label="Custo"
                    error={!!error?.message}
                    helperText={error?.message?.toString()}
                    onChange={(e) => {
                      field.onChange(Number(e.target.value));
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>
        </Box>

        <Box display="flex" gap="20px">
          <Grid container spacing={1}>
            <Grid item xs={2}>
              <Controller
                name="line.locationOrig"
                control={control}
                render={({ field }) => (
                  <AutocompleteLocation
                    label="Origem"
                    name="line.locationOrig"
                    onChange={() => setValue("line.locationOrig", field.value)}
                  />
                )}
              />
            </Grid>
            <Grid item xs={2}>
              <Controller
                name="line.locationDest"
                control={control}
                render={({ field }) => (
                  <AutocompleteLocation
                    label="Destino"
                    name="line.locationDest"
                    onChange={() => setValue("line.locationDest", field.value)}
                  />
                )}
              />
            </Grid>
            <Grid item xs={2}>
              <AutocompleteFleetGroup
                name="line.fleetGroup"
                onChange={(value) => setValue("line.fleetGroup", value)}
              />
            </Grid>
            <Grid item xs={2}>
              <AutocompleteTripType
                name="line.tripType.code"
                onChange={(value) => {
                  setValue("line.tripType", value);
                }}
              />
            </Grid>
          </Grid>
        </Box>
        <Box
          gap="10px"
          display="flex"
          flexDirection="column"
          maxHeight={"300px"}
        >
          <Box display="flex" alignItems="center" gap="8px">
            <Typography variant="subtitle2">Seções da viagem</Typography>
            {countSections > 0 && (
              <Chip label={countSections} color="default" size="small" />
            )}
          </Box>
          {lineSections?.length === 0 && (
            <Box display="flex">
              <Typography variant="body2" color={colors.grey[700]}>
                Não há seções para essa viagem.
              </Typography>
            </Box>
          )}

          <Box gap="16px" display="flex" flexDirection="column">
            {lineSections?.map((_: object, index: number) => (
              <UpdateLineSectionForm key={index} seq={index} />
            ))}
          </Box>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};
