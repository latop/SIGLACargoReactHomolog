"use client";

import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  CircularProgress,
  DialogActions,
  Grid,
  TextField,
} from "@mui/material";
import { Controller, FormProvider } from "react-hook-form";
import { usePlanningModelDialog } from "./usePlanningModelDialog";
import { AutocompleteLocation } from "../AutocompleteLocation";
import { DatePicker } from "../DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "dayjs/locale/pt-br";

dayjs.extend(customParseFormat);

interface PlanningModelDialogProps {
  open: boolean;
  onClose: () => void;
}

export function PlanningModelDialog({
  open,
  onClose,
}: PlanningModelDialogProps) {
  const { planningModelId, methods, isLoading, handleSubmit } =
    usePlanningModelDialog();

  const handleClose = () => {
    methods.reset({});
    onClose();
  };

  const DialogHeader = () => {
    if (planningModelId) return "Atualizar Planejamento de Viagens";
    return "Adicionar Planejamento de Viagens";
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <Dialog
        onClose={handleClose}
        open={open}
        fullWidth
        PaperProps={{
          sx: { maxWidth: "1000px" },
        }}
      >
        <FormProvider {...methods}>
          <form
            style={{ display: "flex", flexDirection: "column", height: "100%" }}
            onSubmit={handleSubmit}
          >
            <DialogTitle
              sx={{ m: 0, p: "1rem 1rem" }}
              id="customized-dialog-title"
            >
              <Box display="flex" justifyContent="space-between">
                <DialogHeader />
              </Box>
            </DialogTitle>
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
            <DialogContent dividers sx={{ padding: "16px" }}>
              {isLoading ? (
                <Box
                  height={"100%"}
                  width={"100%"}
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"center"}
                >
                  <CircularProgress />
                </Box>
              ) : (
                <Grid container gap={2}>
                  <Grid container spacing={1}>
                    <Grid item xs={2}>
                      <Controller
                        control={methods.control}
                        name="startDate"
                        render={({ field, fieldState: { error } }) => (
                          <DatePicker
                            {...field}
                            error={error?.message}
                            label="Data Inicial"
                            value={field.value ? dayjs(field.value) : null}
                            onChange={(date) => field.onChange(date?.format())}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <Controller
                        control={methods.control}
                        name="endDate"
                        render={({ field, fieldState: { error } }) => (
                          <DatePicker
                            {...field}
                            error={error?.message}
                            label="Data Final"
                            value={field.value ? dayjs(field.value) : null}
                            onChange={(date) => field.onChange(date?.format())}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <AutocompleteLocation
                        name="locationOrig.code"
                        label="Origem"
                        onChange={(value) => {
                          methods.setValue("locationOrig.id", value?.id || "");
                          methods.setValue("locationOrigId", value?.id || "");
                        }}
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <AutocompleteLocation
                        name="locationDest.code"
                        label="Destino"
                        onChange={(value) => {
                          methods.setValue("locationDest.id", value?.id || "");
                          methods.setValue("locationDestId", value?.id || "");
                        }}
                      />
                    </Grid>
                  </Grid>
                  <Grid container spacing={1}>
                    <Grid item xs={1}>
                      <Controller
                        control={methods.control}
                        name="freqMon"
                        render={({ field, fieldState: { error } }) => (
                          <TextField
                            {...field}
                            error={!!error}
                            helperText={error?.message}
                            label="Segunda"
                            type="number"
                            variant="outlined"
                            fullWidth
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={1}>
                      <Controller
                        control={methods.control}
                        name="freqTue"
                        render={({ field, fieldState: { error } }) => (
                          <TextField
                            {...field}
                            error={!!error}
                            helperText={error?.message}
                            label="Terça"
                            type="number"
                            variant="outlined"
                            fullWidth
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={1}>
                      <Controller
                        control={methods.control}
                        name="freqWed"
                        render={({ field, fieldState: { error } }) => (
                          <TextField
                            {...field}
                            error={!!error}
                            helperText={error?.message}
                            label="Quarta"
                            type="number"
                            variant="outlined"
                            fullWidth
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={1}>
                      <Controller
                        control={methods.control}
                        name="freqThu"
                        render={({ field, fieldState: { error } }) => (
                          <TextField
                            {...field}
                            error={!!error}
                            helperText={error?.message}
                            label="Quinta"
                            type="number"
                            variant="outlined"
                            fullWidth
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={1}>
                      <Controller
                        control={methods.control}
                        name="freqFri"
                        render={({ field, fieldState: { error } }) => (
                          <TextField
                            {...field}
                            error={!!error}
                            helperText={error?.message}
                            label="Sexta"
                            type="number"
                            variant="outlined"
                            fullWidth
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={1}>
                      <Controller
                        control={methods.control}
                        name="freqSat"
                        render={({ field, fieldState: { error } }) => (
                          <TextField
                            {...field}
                            error={!!error}
                            helperText={error?.message}
                            label="Sábado"
                            type="number"
                            variant="outlined"
                            fullWidth
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={1}>
                      <Controller
                        control={methods.control}
                        name="freqSun"
                        render={({ field, fieldState: { error } }) => (
                          <TextField
                            {...field}
                            error={!!error}
                            helperText={error?.message}
                            label="Domingo"
                            type="number"
                            variant="outlined"
                            fullWidth
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              )}
            </DialogContent>
            <DialogActions>
              <Box
                display="flex"
                justifyContent="flex-end"
                padding="10px"
                width="100%"
              >
                <Button variant="contained" type="submit">
                  {methods.formState.isSubmitting && (
                    <CircularProgress
                      color="inherit"
                      size={20}
                      sx={{ margin: "2px 11.45px" }}
                    />
                  )}
                  {!methods.formState.isSubmitting && `Salvar`}
                </Button>
              </Box>
            </DialogActions>
          </form>
        </FormProvider>
      </Dialog>
    </LocalizationProvider>
  );
}
