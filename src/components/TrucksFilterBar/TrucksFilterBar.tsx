"use client";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { Controller, FormProvider } from "react-hook-form";
import { Box, Button, Grid, TextField } from "@mui/material";
import { GridSearchIcon } from "@mui/x-data-grid";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import customParseFormat from "dayjs/plugin/customParseFormat";
import "dayjs/locale/pt-br";
import dayjs from "dayjs";
import { useTrucksFilterBar } from "./useTrucksFilterBar";
import { AutocompleteTruck } from "../AutocompleteTruck";
// import { AutocompleteFleetGroup } from "../AutocompleteFleetGroup/AutocompleteFleetGroup_old";
import { AutocompleteLocationGroup } from "../AutocompleteLocationGroup";
import { AutocompleteFleetType } from "../AutocompleteFleetType";

dayjs.extend(customParseFormat);

export function TrucksFilterBar() {
  const { methods, onSubmit, onClearParams } = useTrucksFilterBar();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <FormProvider {...methods}>
        <Box display={"flex"}>
          <form style={{ width: "100%", display: "flex" }}>
            <Grid
              container
              justifyContent="space-between"
              gap="16px"
              direction={"row"}
            >
              <Grid container alignItems="flex-start" width="100%" gap="16px">
                <Grid xs={1.5} item>
                  <AutocompleteTruck
                    name="licensePlate"
                    isUpperCase
                    onChange={(value) => {
                      methods.setValue(
                        "licensePlate",
                        value?.licensePlate || "",
                      );
                    }}
                  />
                </Grid>
                <Grid xs={1.5} item>
                  <Controller
                    name="fleetCode"
                    control={methods.control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        onChange={(e) => {
                          field.onChange(e.target.value.toUpperCase());
                        }}
                        label="Cód. Frota"
                      />
                    )}
                  />
                </Grid>
                <Grid xs={1.5} item>
                  <AutocompleteFleetType
                    name="fleetType"
                    label="Tipo de Frota"
                  />
                </Grid>
                <Grid xs={1.5} item>
                  <AutocompleteLocationGroup
                    label=" Grupo de Localidade"
                    name="locationGroupCode"
                    onChange={(value) => {
                      methods.setValue("locationGroupCode", value?.code || "");
                      methods.setValue("locationGroupId", value?.id || "");
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </form>
          <Box
            display="flex"
            justifyContent={"space-between"}
            maxWidth={"170px"}
            width={"100%"}
          >
            <Button color="primary" onClick={onClearParams} variant="outlined">
              Limpar
            </Button>
            <Button
              onClick={onSubmit}
              type="submit"
              variant="contained"
              color="primary"
            >
              <GridSearchIcon />
            </Button>
          </Box>
        </Box>
      </FormProvider>
    </LocalizationProvider>
  );
}
