import React from "react";
// import { useFormContext } from "react-hook-form";
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "dayjs/locale/pt-br";
import { DriverTabs } from "../DriverTabs/DriverTabs";
import { Controller, useFormContext } from "react-hook-form";
import { Driver } from "@/interfaces/driver";
import { DatePicker } from "@/components/DatePicker";
import { formatCellphone, formatCep } from "@/utils";
import { AutocompleteContries } from "@/components/AutocompleteCountries";
import { AutocompleteStates } from "@/components/AutocompleteStates";
import { AutocompleteCities } from "@/components/AutocompleteCities";

dayjs.extend(customParseFormat);

export const DriverForm = () => {
  const methods = useFormContext<Driver>();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <Box display="flex" flexDirection="column" gap="16px" mt="5px">
        <Box display="flex" flexDirection="column" gap="8px" mt="5px">
          <Grid container spacing={1}>
            <Grid item xs={3}>
              <Controller
                control={methods.control}
                name={"name"}
                render={({ field }) => {
                  return (
                    <TextField
                      {...field}
                      label="Nome"
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
            <Grid item xs={3}>
              <Controller
                control={methods.control}
                name={"lastName"}
                render={({ field }) => {
                  return (
                    <TextField
                      {...field}
                      label="Sobrenome"
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
                name={"nickName"}
                render={({ field }) => {
                  return (
                    <TextField
                      {...field}
                      label="Apelido"
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
                name={"registration"}
                render={({ field }) => {
                  return (
                    <TextField
                      {...field}
                      label="CPF"
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
                name={"identification"}
                render={({ field }) => {
                  return (
                    <TextField
                      {...field}
                      label="RG"
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
                name={"seniority"}
                render={({ field }) => {
                  return (
                    <TextField
                      {...field}
                      label="Serionidade"
                      variant="outlined"
                      fullWidth
                    />
                  );
                }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={1}>
            <Grid item xs={1.5}>
              <Controller
                control={methods.control}
                name="genre"
                render={({ field }) => (
                  <FormControl>
                    <FormLabel
                      sx={{
                        height: "10px",
                        fontSize: "12px",
                      }}
                    >
                      Gênero
                    </FormLabel>
                    <RadioGroup
                      {...field}
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        "& .MuiTypography-root ": {
                          fontSize: "12px",
                        },
                      }}
                    >
                      <FormControlLabel
                        value="F"
                        control={<Radio size="small" />}
                        label="F"
                      />
                      <FormControlLabel
                        value="M"
                        control={<Radio size="small" />}
                        label="M"
                      />
                    </RadioGroup>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={1.5}>
              <Controller
                control={methods.control}
                name={"birthdate"}
                render={({ field }) => {
                  return (
                    <DatePicker
                      {...field}
                      label="Data de nasc."
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
                name={"admission"}
                render={({ field }) => {
                  return (
                    <DatePicker
                      {...field}
                      label="Admissão"
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
                name={"resign"}
                render={({ field }) => {
                  return (
                    <DatePicker
                      {...field}
                      label="Demissão"
                      value={field.value ? dayjs(field.value) : null}
                      onChange={(date) => field.onChange(date?.format())}
                    />
                  );
                }}
              />
            </Grid>
            <Grid item xs={3}>
              <Controller
                control={methods.control}
                name={"integrationCodeGPS"}
                render={({ field }) => {
                  return (
                    <TextField
                      {...field}
                      label="Código de Integração GPS"
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
                name={"integrationCode"}
                render={({ field }) => {
                  return (
                    <TextField
                      {...field}
                      label="GPID"
                      variant="outlined"
                      fullWidth
                    />
                  );
                }}
              />
            </Grid>
            <Grid item xs={1}>
              <Controller
                control={methods.control}
                name={"isActive"}
                render={({ field }) => {
                  return (
                    <FormControlLabel
                      control={<Checkbox {...field} checked={field.value} />}
                      label="Ativo"
                    />
                  );
                }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Controller
                control={methods.control}
                name={"address"}
                render={({ field }) => {
                  return (
                    <TextField
                      {...field}
                      label="Endereço"
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
                name={"zipCode"}
                render={({ field }) => {
                  return (
                    <TextField
                      {...field}
                      label="CEP"
                      variant="outlined"
                      fullWidth
                      onChange={(e) => {
                        const formattedValue = formatCep(e.target.value);
                        field.onChange(formattedValue);
                      }}
                    />
                  );
                }}
              />
            </Grid>
            <Grid item xs={1.5}>
              <AutocompleteCities
                name="city"
                label="Cidade"
                onChange={(value) => {
                  methods.setValue("city", value || undefined);
                }}
              />
            </Grid>
            <Grid item xs={1.5}>
              <AutocompleteStates
                name="state"
                label="Estado"
                onChange={(value) => {
                  methods.setValue("state", value || undefined);
                }}
              />
            </Grid>
            <Grid item xs={1.5}>
              <AutocompleteContries
                label="País"
                name="countryId"
                onChange={(value) => {
                  methods.setValue("countryId", value?.id || "");
                }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={1}>
            <Grid item xs={3}>
              <Controller
                control={methods.control}
                name={"email"}
                render={({ field }) => {
                  return (
                    <TextField
                      {...field}
                      label="Email"
                      variant="outlined"
                      fullWidth
                      InputProps={{
                        inputProps: {
                          pattern:
                            "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
                          title:
                            "Enter a valid email address (e.g., user@example.com)",
                        },
                      }}
                    />
                  );
                }}
              />
            </Grid>
            <Grid item xs={1.5}>
              <Controller
                control={methods.control}
                name={"phone1"}
                render={({ field }) => {
                  return (
                    <TextField
                      {...field}
                      label="Telefone"
                      variant="outlined"
                      fullWidth
                      onChange={(e) => {
                        const formattedValue = formatCellphone(e.target.value);
                        field.onChange(formattedValue);
                      }}
                    />
                  );
                }}
              />
            </Grid>
            <Grid item xs={1.5}>
              <Controller
                control={methods.control}
                name="phone2"
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Celular"
                    variant="outlined"
                    fullWidth
                    onChange={(e) => {
                      const formattedValue = formatCellphone(e.target.value);
                      field.onChange(formattedValue);
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                control={methods.control}
                name={"note"}
                render={({ field }) => {
                  return (
                    <TextField
                      {...field}
                      label="Observações"
                      variant="outlined"
                      fullWidth
                    />
                  );
                }}
              />
            </Grid>
          </Grid>
        </Box>
        <DriverTabs />
      </Box>
    </LocalizationProvider>
  );
};
