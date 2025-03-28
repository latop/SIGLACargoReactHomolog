"use client";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { Controller, FormProvider } from "react-hook-form";
import {
  Box,
  Button,
  FormControl,
  Grid,
  MenuItem,
  TextField,
} from "@mui/material";
import { GridSearchIcon } from "@mui/x-data-grid";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import customParseFormat from "dayjs/plugin/customParseFormat";
import "dayjs/locale/pt-br";
import dayjs from "dayjs";
import { useJustificationFilterBar } from "./useJustificationFilterBar";
import { AutocompleteResponsibleSector } from "../AutocompleteResponsibleSector";

dayjs.extend(customParseFormat);

export function JustificationFilterBar() {
  const { methods, onClearParams, onSubmit, handleAddJustification } =
    useJustificationFilterBar();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <FormProvider {...methods}>
        <Box display={"flex"} gap="16px">
          <form style={{ width: "100%", display: "flex" }}>
            <Grid
              container
              justifyContent="space-between"
              gap="16px"
              direction={"row"}
            >
              <Grid container alignItems="flex-start" width="100%" gap="16px">
                <Grid xs={2} item>
                  <Controller
                    name="code"
                    control={methods.control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Código"
                        onChange={(e) => {
                          field.onChange(e.target.value.toUpperCase());
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid xs={2} item>
                  <AutocompleteResponsibleSector
                    name="responsibleSectorDescription"
                    keyCode="description"
                    onChange={(value) => {
                      methods.setValue("responsibleSectorId", value?.id);
                      methods.setValue(
                        "responsibleSectorDescription",
                        value?.description,
                      );
                    }}
                  />
                </Grid>
                <Grid xs={2} item>
                  <Controller
                    control={methods.control}
                    name="type"
                    render={({ field, fieldState: { error } }) => (
                      <FormControl>
                        <TextField
                          select
                          label="Tipo"
                          sx={{ minWidth: 154 }}
                          {...field}
                          error={!!error}
                          helperText={error?.message}
                          value={
                            field.value === null || field.value === undefined
                              ? "null"
                              : field.value.toString()
                          }
                          onChange={(e) => {
                            const value =
                              e.target.value === "null" ? null : e.target.value;
                            field.onChange(value);
                          }}
                        >
                          <MenuItem value="A">A - Atraso</MenuItem>
                          <MenuItem value="C">C - Cancelamento</MenuItem>
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
            maxWidth={"270px"}
            width={"100%"}
          >
            <Button color="primary" onClick={onClearParams} variant="outlined">
              Limpar
            </Button>
            <Button onClick={handleAddJustification} variant="outlined">
              Adicionar
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
