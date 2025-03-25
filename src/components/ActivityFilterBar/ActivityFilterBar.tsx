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
import { useActivityFilterBar } from "./useActivityFilterBar";
import { AutocompleteActivityType } from "../AutocompleteActivityType";

dayjs.extend(customParseFormat);

export function ActivityFilterBar() {
  const { methods, onClearParams, onSubmit, handleAddActivity } =
    useActivityFilterBar();

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
                  <AutocompleteActivityType
                    name="activityTypeCode"
                    label="Tipo de Atividade"
                    onChange={(field) => {
                      methods.setValue("activityTypeId", field.id);
                      methods.setValue("activityTypeCode", field?.code);
                    }}
                  />
                </Grid>
                <Grid xs={2} item>
                  <Controller
                    control={methods.control}
                    name="flgActive"
                    render={({ field, fieldState: { error } }) => (
                      <FormControl>
                        <TextField
                          select
                          label="Ativo"
                          sx={{ minWidth: 154 }}
                          {...field}
                          error={!!error}
                          helperText={error?.message}
                          defaultValue={field.value}
                          onChange={(e) => {
                            const value =
                              !e.target.value === undefined
                                ? undefined
                                : e.target.value;
                            field.onChange(value);
                          }}
                        >
                          <MenuItem value="true">Sim</MenuItem>
                          <MenuItem value="false">Não</MenuItem>
                          <MenuItem value={"undefined"}>Todos</MenuItem>
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
            <Button onClick={handleAddActivity} variant="outlined">
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
