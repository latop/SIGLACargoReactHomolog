"use client";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { useDriversFilterBar } from "./useDriversFilterBar";
import { Controller, FormProvider } from "react-hook-form";
import { Box, Button, Grid, TextField } from "@mui/material";
import { GridSearchIcon } from "@mui/x-data-grid";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { AutocompleteDriver } from "../AutocompleteDriver";
import { DatePicker } from "../DatePicker";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "dayjs/locale/pt-br";
import dayjs from "dayjs";
import { AutocompleteLocationGroup } from "../AutocompleteLocationGroup";
import { AutocompleteFleetGroup } from "../AutocompleteFleetGroup";
import { AutocompletePosition } from "../AutocompletePosition";

dayjs.extend(customParseFormat);

export function DriversFilterBar() {
  const { methods, onSubmit, onClearParams } = useDriversFilterBar();

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
              <Grid container direction={"row"} gap={"8px"}>
                <Grid xs={1.5} item>
                  <AutocompleteDriver
                    name={"nickName"}
                    onChange={(value) => {
                      methods.setValue("nickName", value?.nickName);
                    }}
                  />
                </Grid>
                <Grid xs={1.5}>
                  <AutocompleteLocationGroup
                    name="locationGroupId"
                    onChange={(value) => {
                      methods.setValue("locationGroupId", value?.id || "");
                    }}
                  />
                </Grid>
                <Grid xs={1.5}>
                  <AutocompleteFleetGroup
                    name="fleetGroupId"
                    onChange={(value) => {
                      methods.setValue("fleetGroupId", value?.id || "");
                    }}
                  />
                </Grid>
                <Grid xs={1.5}>
                  <AutocompletePosition
                    name="positionId"
                    onChange={(value) => {
                      methods.setValue("positionId", value?.id || "");
                    }}
                  />
                </Grid>
                <Grid xs={1.5} item>
                  <Controller
                    name="integrationCode"
                    control={methods.control}
                    render={({ field }) => {
                      return (
                        <TextField
                          label="GPID"
                          {...field}
                          value={field.value}
                        />
                      );
                    }}
                  />
                </Grid>
                <Grid xs={1.5} item>
                  <Controller
                    name="registration"
                    control={methods.control}
                    render={({ field }) => {
                      return (
                        <TextField label="CPF" {...field} value={field.value} />
                      );
                    }}
                  />
                </Grid>
                <Grid xs={2} item>
                  <Controller
                    name="admission"
                    control={methods.control}
                    render={({ field, fieldState: { error } }) => (
                      <DatePicker
                        label="Data de Referência"
                        {...field}
                        error={error?.message}
                        value={dayjs(dayjs(field.value).format("YYYY-MM-DD"))}
                      />
                    )}
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
