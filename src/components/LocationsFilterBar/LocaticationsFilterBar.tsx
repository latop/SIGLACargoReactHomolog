"use client";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { Controller, FormProvider } from "react-hook-form";
import {
  Box,
  Button,
  FormControl,
  Grid,
  TextField,
  MenuItem,
} from "@mui/material";
import { GridSearchIcon } from "@mui/x-data-grid";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import customParseFormat from "dayjs/plugin/customParseFormat";
import "dayjs/locale/pt-br";
import dayjs from "dayjs";
import { useLocationsFilterBar } from "./useLocationsFilterBar";
import { AutocompleteLocationType } from "../AutocompleteLocationType";
import { AutocompleteLocationGroup } from "../AutocompleteLocationGroup";

dayjs.extend(customParseFormat);

export function LocationsFilterBar() {
  const { methods, onClearParams, onSubmit } = useLocationsFilterBar();
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
                  <Controller
                    name="locationCode"
                    control={methods.control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Cód. do Local"
                        onChange={(e) => {
                          field.onChange(e.target.value.toUpperCase());
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid xs={1.5} item>
                  <Controller
                    name="integrationCode2" //tms
                    control={methods.control}
                    render={({ field }) => (
                      <TextField {...field} label="Cód. TMS" />
                    )}
                  />
                </Grid>
                <Grid xs={1.5} item>
                  <Controller
                    name="integrationCode" //gps
                    control={methods.control}
                    render={({ field }) => (
                      <TextField {...field} label="Cód. GPS" />
                    )}
                  />
                </Grid>
                <Grid xs={1.5} item>
                  <AutocompleteLocationGroup
                    name="locationGroupCode"
                    onChange={(value) => {
                      methods.setValue("locationGroupCode", value?.code || "");
                      methods.setValue("locationGroupId", value?.id || "");
                    }}
                  />
                </Grid>
                <Grid xs={1.5} item>
                  <AutocompleteLocationType
                    name="locationTypeCode"
                    onChange={(value) => {
                      methods.setValue("locationTypeCode", value?.code || "");
                      methods.setValue("locationTypeId", value?.id || "");
                    }}
                  />
                </Grid>
                <Grid item>
                  <Controller
                    name="isOperation"
                    control={methods.control}
                    render={({ field }) => (
                      <FormControl>
                        <TextField
                          select
                          label="Operacional"
                          size="small"
                          {...field}
                          value={
                            field.value === null || field.value === undefined
                              ? "null"
                              : field.value.toString()
                          }
                          onChange={(e) => {
                            const value =
                              e.target.value === "null"
                                ? null
                                : e.target.value === "true";
                            field.onChange(value);
                          }}
                          sx={{ minWidth: 120 }}
                        >
                          <MenuItem value="true">Sim</MenuItem>
                          <MenuItem value="false">Não</MenuItem>
                          <MenuItem value="null">Todos</MenuItem>
                        </TextField>
                      </FormControl>
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
