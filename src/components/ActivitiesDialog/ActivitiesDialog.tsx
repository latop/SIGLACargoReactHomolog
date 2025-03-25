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
  Checkbox,
  CircularProgress,
  DialogActions,
  FormControlLabel,
  Grid,
  TextField,
} from "@mui/material";
import { useActivityTypeDialog } from "./useActivitiesDialog";
import { Controller, FormProvider } from "react-hook-form";
import { grey } from "@mui/material/colors";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { TimePicker } from "../TimePicker";
import dayjs from "dayjs";
import { AutocompleteActivityType } from "../AutocompleteActivityType";

interface ActivitiesDialogProps {
  open: boolean;
  onClose: () => void;
}

export function ActivitiesDialog({ open, onClose }: ActivitiesDialogProps) {
  const { activityTypeId, methods, isLoading, handleSubmit } =
    useActivityTypeDialog();

  const handleClose = () => {
    methods.reset({});
    onClose();
  };

  const DialogHeader = () => {
    if (activityTypeId) return "Atualizar Atividade";
    return "Adicionar Atividade";
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
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
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
                <Grid container gap={1}>
                  <Grid item xs={2}>
                    <Controller
                      control={methods.control}
                      name="code"
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          {...field}
                          error={!!error}
                          helperText={error?.message}
                          label="Código"
                          variant="outlined"
                          fullWidth
                          onChange={(e) => {
                            field.onChange(e.target.value.toUpperCase());
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={9.8}>
                    <Controller
                      control={methods.control}
                      name="description"
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          {...field}
                          error={!!error}
                          helperText={error?.message}
                          label="Descrição"
                          variant="outlined"
                          fullWidth
                          onChange={(e) => {
                            field.onChange(e.target.value.toUpperCase());
                          }}
                        />
                      )}
                    />
                  </Grid>

                  <Grid container gap={1}>
                    <Grid item xs={2}>
                      <AutocompleteActivityType
                        label="Tipo de Atividade"
                        name="activityType.code"
                        onChange={(field) => {
                          methods.setValue("activityTypeId", field.id);
                          methods.setValue("activityType.code", field?.code);
                        }}
                      />
                    </Grid>
                    <Grid item xs={1.5}>
                      <Controller
                        control={methods.control}
                        name="start"
                        render={({ field, fieldState: { error } }) => (
                          <TimePicker
                            {...field}
                            value={
                              field.value ? dayjs(field.value as string) : null
                            }
                            onChange={(time) => {
                              field.onChange(time?.format());
                            }}
                            error={error?.message}
                            ampm={false}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={1.5}>
                      <Controller
                        control={methods.control}
                        name="end"
                        render={({ field, fieldState: { error } }) => (
                          <TimePicker
                            {...field}
                            value={
                              field.value ? dayjs(field.value as string) : null
                            }
                            onChange={(time) => {
                              field.onChange(time?.format());
                            }}
                            error={error?.message}
                            ampm={false}
                          />
                        )}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={3}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <Controller
                        control={methods.control}
                        name={"flgActive"}
                        render={({ field }) => {
                          return (
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
                                alignItems: "center",
                              }}
                              control={
                                <Checkbox
                                  size="small"
                                  sx={{
                                    padding: "0",
                                  }}
                                  {...field}
                                  checked={field.value}
                                />
                              }
                              label="Ativo"
                            />
                          );
                        }}
                      />
                      <Controller
                        control={methods.control}
                        name={"flgMeal"}
                        render={({ field }) => {
                          return (
                            <FormControlLabel
                              componentsProps={{
                                typography: {
                                  sx: {
                                    fontSize: "12px",
                                    color: grey[600],
                                    width: "80px",
                                  },
                                },
                              }}
                              sx={{
                                display: "flex",
                                flexDirection: "column-reverse",
                                margin: "0",
                                alignItems: "center",
                              }}
                              control={
                                <Checkbox
                                  size="small"
                                  sx={{
                                    padding: "0",
                                  }}
                                  {...field}
                                  checked={field.value}
                                />
                              }
                              label="Paga Refeição"
                            />
                          );
                        }}
                      />
                      <Controller
                        control={methods.control}
                        name={"flgLunch"}
                        render={({ field }) => {
                          return (
                            <FormControlLabel
                              componentsProps={{
                                typography: {
                                  sx: {
                                    fontSize: "12px",
                                    color: grey[600],
                                    width: "110px",
                                  },
                                },
                              }}
                              sx={{
                                display: "flex",
                                flexDirection: "column-reverse",
                                margin: "0",
                                alignItems: "center",
                              }}
                              control={
                                <Checkbox
                                  size="small"
                                  sx={{
                                    padding: "0",
                                  }}
                                  {...field}
                                  checked={field.value}
                                />
                              }
                              label="Desconta Refeição"
                            />
                          );
                        }}
                      />
                      <Controller
                        control={methods.control}
                        name={"flgRest"}
                        render={({ field }) => {
                          return (
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
                                alignItems: "center",
                              }}
                              control={
                                <Checkbox
                                  size="small"
                                  sx={{
                                    padding: "0",
                                  }}
                                  {...field}
                                  checked={field.value}
                                />
                              }
                              label="Repouso"
                            />
                          );
                        }}
                      />
                      <Controller
                        control={methods.control}
                        name={"flgRequest"}
                        render={({ field }) => {
                          return (
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
                                alignItems: "center",
                              }}
                              control={
                                <Checkbox
                                  size="small"
                                  sx={{
                                    padding: "0",
                                  }}
                                  {...field}
                                  checked={field.value}
                                />
                              }
                              label="Pedido"
                            />
                          );
                        }}
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
      </LocalizationProvider>
    </Dialog>
  );
}
