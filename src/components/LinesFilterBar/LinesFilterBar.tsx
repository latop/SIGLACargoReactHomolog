"use client";

import React from "react";
import dayjs from "dayjs";
import { Controller, FormProvider } from "react-hook-form";
import { Box, Button, Grid } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TextField } from "@mui/material";
import { useLinesFilterBar } from "./useLinesFilterBar";
import SearchIcon from "@mui/icons-material/Search";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "dayjs/locale/pt-br";
import { AutocompleteFleetGroup } from "../AutocompleteFleetGroup";
import { AutocompleteLocation } from "../AutocompleteLocation";
import { FleetGroup } from "@/interfaces/vehicle";
import { Location, TripType } from "@/interfaces/trip";
import { AutocompleteTripType } from "../AutocompleteTripType";
import debounce from "debounce";

dayjs.extend(customParseFormat);

interface LinesFilterBarProps extends React.HTMLProps<HTMLFormElement> {
  onAddLine: () => void;
  isLoading: boolean;
}

export function LinesFilterBar({
  onAddLine,
  isLoading,
  ...props
}: LinesFilterBarProps) {
  const { methods, onSubmit, onClearParams } = useLinesFilterBar();
  const { control, handleSubmit, setValue } = methods;

  const handleChangeFleetGroup = (value: FleetGroup | null) => {
    setValue("fleetGroupId", value?.id || "");
    setValue("fleetGroupCode", value?.code || "");
  };

  const handleChangeLocationOrig = (value?: Location | null) => {
    setValue("locationOrigId", value?.id || "");
    setValue("locationOrigCode", value?.code || "");
  };

  const handleChangeLocationDest = (value?: Location | null) => {
    setValue("locationDestId", value?.id || "");
    setValue("locationDestCode", value?.code || "");
  };

  const handleChangeTripType = (value: TripType | null) => {
    setValue("tripTypeId", value?.id || "");
    setValue("tripTypeCode", value?.code || "");
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <FormProvider {...methods}>
        <Box display={"flex"}>
          <form {...props} style={{ width: "100%" }}>
            <Grid container alignItems="flex-start" width="100%" gap="16px">
              <Grid item xs={3} paddingLeft="0">
                <Controller
                  name="code"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      variant="outlined"
                      fullWidth
                      label="Código da Rota"
                      error={!!error?.message}
                      helperText={error?.message?.toString()}
                      inputProps={{
                        sx: {
                          textTransform: "uppercase",
                        },
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={2} paddingLeft="0">
                <AutocompleteFleetGroup
                  name="fleetGroupCode"
                  key={"code"}
                  onChange={handleChangeFleetGroup}
                />
              </Grid>
              <Grid item xs={1.7} paddingLeft="0">
                <AutocompleteLocation
                  name="locationOrigCode"
                  label="Origem"
                  keyCode="id"
                  onChange={handleChangeLocationOrig}
                />
              </Grid>
              <Grid item xs={1.6} paddingLeft="0">
                <AutocompleteLocation
                  name="locationDestCode"
                  label="Destino"
                  keyCode="id"
                  onChange={handleChangeLocationDest}
                />
              </Grid>
              <Grid item xs={1.6} paddingLeft="0">
                <AutocompleteTripType
                  name="tripTypeCode"
                  label="Tipo de Viagem"
                  onChange={handleChangeTripType}
                />
              </Grid>
            </Grid>
          </form>
          <Box display="flex" gap="16px">
            <Button
              variant="outlined"
              color="primary"
              onClick={onClearParams}
              disabled={isLoading}
            >
              Limpar
            </Button>
            <Button variant="outlined" onClick={onAddLine} disabled={isLoading}>
              Adicionar
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={debounce(handleSubmit(onSubmit), 300)}
            >
              <SearchIcon />
            </Button>
          </Box>
        </Box>
      </FormProvider>
    </LocalizationProvider>
  );
}
