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
import { useTimezoneValueDialog } from "./useTimezoneValueDialog";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { Timezone } from "@/services/query/parameters";
import { AutocompleteTimezone } from "../AutocompleteTimzone";
import dayjs from "dayjs";

interface TimezoneValueDialogProps {
  open: boolean;
  onClose: () => void;
}

export function TimezoneValueDialog({
  open,
  onClose,
}: TimezoneValueDialogProps) {
  const { timezoneValueId, methods, isLoading, handleSubmit } =
    useTimezoneValueDialog();

  const handleClose = () => {
    methods.reset({});
    onClose();
  };

  const DialogHeader = () => {
    if (timezoneValueId) return "Atualizar Valor de Fuso Horário";
    return "Adicionar Valor de Fuso Horário";
  };

  return (
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
              <Grid container spacing={1}>
                <Grid item xs={3}>
                  <AutocompleteTimezone
                    name="timezone.code"
                    label="Fuso Horário"
                    onChange={(value) => {
                      methods.setValue("timezone", (value as Timezone) || {});
                    }}
                  />
                </Grid>
                <Grid item xs={3}>
                  <Controller
                    control={methods.control}
                    name="value"
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        error={!!error}
                        helperText={error?.message}
                        label="Valor"
                        variant="outlined"
                        fullWidth
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={3}>
                  <Controller
                    control={methods.control}
                    name="start"
                    render={({ field, fieldState: { error } }) => (
                      <DatePicker
                        label="Data Início"
                        value={field.value ? dayjs(field.value) : null}
                        onChange={(date) => field.onChange(date)}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: !!error,
                            helperText: error?.message,
                          },
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={3}>
                  <Controller
                    control={methods.control}
                    name="end"
                    render={({ field, fieldState: { error } }) => (
                      <DatePicker
                        label="Data Fim"
                        value={field.value ? dayjs(field.value) : null}
                        onChange={(date) => field.onChange(date)}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: !!error,
                            helperText: error?.message,
                          },
                        }}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions sx={{ padding: "16px" }}>
            <Button onClick={handleClose} variant="outlined">
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{ backgroundColor: "#24438F" }}
            >
              Salvar
            </Button>
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog>
  );
}
