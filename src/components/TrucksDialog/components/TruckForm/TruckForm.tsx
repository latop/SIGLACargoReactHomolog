import React from "react";
import {
  Box,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { AutocompleteStates } from "@/components/AutocompleteStates";
import { AutocompleteLocationGroup } from "@/components/AutocompleteLocationGroup";
import { TruckFormType } from "../../useTrucksDialog";
import { DatePicker } from "@/components/DatePicker";
import { AutocompleteFleetType } from "@/components/AutocompleteFleetType";
import { grey, red } from "@mui/material/colors";
import dayjs from "dayjs";

export const TruckForm = () => {
  const methods = useFormContext<TruckFormType>();

  return (
    <Box display="flex" flexDirection="column" gap="16px" mt="5px">
      <Grid container spacing={1}>
        <Grid item xs={2}>
          <Controller
            control={methods.control}
            name={"licensePlate"}
            render={({ field, fieldState: { error } }) => {
              return (
                <TextField
                  error={!!error}
                  helperText={error?.message}
                  {...field}
                  label="Placa"
                  variant="outlined"
                  fullWidth
                  onChange={(e) => {
                    if (e.target.value.length > 7) return;
                    field.onChange(e.target.value.toUpperCase());
                  }}
                />
              );
            }}
          />
        </Grid>
        <Grid item xs={1.5}>
          <Controller
            control={methods.control}
            name={"fleetCode"}
            render={({ field, fieldState: { error } }) => {
              return (
                <TextField
                  error={!!error}
                  helperText={error?.message}
                  {...field}
                  label="Cód. da Frota"
                  variant="outlined"
                  fullWidth
                  onChange={(e) => {
                    field.onChange(e.target.value.toUpperCase());
                  }}
                />
              );
            }}
          />
        </Grid>
        <Grid item xs={1.5}>
          <Controller
            control={methods.control}
            name={"manufactureYear"}
            render={({ field, fieldState: { error } }) => {
              return (
                <DatePicker
                  views={["year"]}
                  label="Ano Fabricação"
                  {...field}
                  error={error?.message}
                  value={field.value ? dayjs(field.value + 1) : null}
                />
              );
            }}
          />
        </Grid>
        <Grid item xs={1.6}>
          <AutocompleteStates
            hasSkeleton
            name="state.name"
            label="Estado Emplacamento"
            onChange={(value) => {
              methods.setValue("stateId", value?.id || "");
            }}
          />
        </Grid>
        <Grid item xs={1.5}>
          <Controller
            control={methods.control}
            name={"startDate"}
            render={({ field, fieldState: { error } }) => {
              return (
                <DatePicker
                  label="Data Inicio"
                  {...field}
                  error={error?.message}
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(date) => field.onChange(date?.format())}
                />
              );
            }}
          />
        </Grid>
        <Grid item xs={1.5}>
          <Controller
            control={methods.control}
            name={"endDate"}
            render={({ field, fieldState: { error } }) => {
              return (
                <DatePicker
                  label="Data Fim"
                  {...field}
                  {...field}
                  error={error?.message}
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(date) => field.onChange(date?.format())}
                />
              );
            }}
          />
        </Grid>
      </Grid>
      <Grid container spacing={1}>
        <Grid item xs={2}>
          <AutocompleteFleetType
            hasSkeleton
            name="fleetType.code"
            label="Tipo da frota"
            onChange={(value) => {
              methods.setValue("fleetTypeId", value?.id || "");
            }}
          />
        </Grid>
        <Grid item xs={1.5}>
          <AutocompleteLocationGroup
            hasSkeleton
            name="locationGroup.code"
            onChange={(value) => {
              methods.setValue("locationGroupId", value?.id || "");
            }}
          />
        </Grid>
        <Grid item xs={3.1}>
          <Controller
            control={methods.control}
            name={"chassisNumber"}
            render={({ field, fieldState: { error } }) => {
              return (
                <TextField
                  error={!!error}
                  helperText={error?.message}
                  {...field}
                  label="Chassi"
                  variant="outlined"
                  fullWidth
                  onChange={(e) => {
                    field.onChange(e.target.value.toUpperCase());
                  }}
                />
              );
            }}
          />
        </Grid>
        <Grid item xs={1.5}>
          <Controller
            control={methods.control}
            name={"regulatoryNumber"}
            render={({ field, fieldState: { error } }) => {
              return (
                <TextField
                  error={!!error}
                  helperText={error?.message}
                  {...field}
                  label="Renavam"
                  variant="outlined"
                  fullWidth
                  onChange={(e) => {
                    field.onChange(e.target.value.toUpperCase());
                  }}
                />
              );
            }}
          />
        </Grid>
        <Grid item xs={1.5}>
          <Controller
            control={methods.control}
            name={"serialNumber"}
            render={({ field, fieldState: { error } }) => {
              return (
                <TextField
                  error={!!error}
                  helperText={error?.message}
                  {...field}
                  label="Número de Série"
                  variant="outlined"
                  fullWidth
                  onChange={(e) => {
                    field.onChange(e.target.value.toUpperCase());
                  }}
                />
              );
            }}
          />
        </Grid>
      </Grid>
      <Grid container spacing={1}>
        <Grid item xs={2}>
          <Controller
            control={methods.control}
            name={"integrationCode"}
            render={({ field, fieldState: { error } }) => {
              return (
                <TextField
                  error={!!error}
                  helperText={error?.message}
                  {...field}
                  label="Cód. Integração"
                  variant="outlined"
                  fullWidth
                />
              );
            }}
          />
        </Grid>
        <Grid item xs={1.5}>
          <Controller
            control={methods.control}
            name={"tare"}
            render={({ field, fieldState: { error } }) => {
              return (
                <TextField
                  error={!!error}
                  helperText={error?.message}
                  {...field}
                  label="Tara"
                  variant="outlined"
                  fullWidth
                  onChange={(e) => {
                    if (isNaN(Number(e.target.value))) return;
                    field.onChange(e.target.value);
                  }}
                />
              );
            }}
          />
        </Grid>
        <Grid item xs={1}>
          <Controller
            control={methods.control}
            name={"capacity"}
            render={({ field, fieldState: { error } }) => {
              return (
                <TextField
                  error={!!error}
                  helperText={error?.message}
                  {...field}
                  label="Capacidade"
                  variant="outlined"
                  fullWidth
                  onChange={(e) => {
                    if (isNaN(Number(e.target.value))) return;
                    field.onChange(e.target.value);
                  }}
                />
              );
            }}
          />
        </Grid>
        <Grid item xs={2.1}>
          <Controller
            control={methods.control}
            name={"regulatoryValidity"}
            render={({ field, fieldState: { error } }) => {
              return (
                <DatePicker
                  label="Dt. Vencimento Revisão"
                  {...field}
                  error={error?.message}
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(date) => field.onChange(date?.format())}
                />
              );
            }}
          />
        </Grid>
        <Grid item xs={1.5}>
          <Controller
            name={"isRefurbished"}
            control={methods.control}
            render={({ field, fieldState: { error } }) => (
              <FormControlLabel
                componentsProps={{
                  typography: {
                    sx: {
                      fontSize: "12px",
                      color: grey[600],
                    },
                  },
                }}
                sx={{
                  display: "flex",
                  flexDirection: "column-reverse",
                  margin: "0",
                  alignItems: "flex-start",
                }}
                control={
                  <Box display={"flex"}>
                    <Checkbox
                      size="small"
                      sx={{
                        padding: "0",
                      }}
                      {...field}
                      checked={field.value}
                    />
                    {error?.message && (
                      <Typography fontSize="12px" color={red[700]}>
                        {error.message}
                      </Typography>
                    )}
                  </Box>
                }
                label={"Recondicionado"}
              />
            )}
          />
        </Grid>
      </Grid>
      <Grid container spacing={1}>
        <Grid item xs={8.1}>
          <Controller
            control={methods.control}
            name={"note"}
            render={({ field, fieldState: { error } }) => {
              return (
                <TextField
                  error={!!error}
                  helperText={error?.message}
                  {...field}
                  label="Observações"
                  variant="outlined"
                  fullWidth
                  onChange={(e) => {
                    methods.setValue("note", e.target.value || "");
                  }}
                />
              );
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};
