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
  FormControl,
  Grid,
  MenuItem,
  TextField,
} from "@mui/material";
import { Controller, FormProvider } from "react-hook-form";
import { useJustificationsDialog } from "./useJustificationsDialog";
import { AutocompleteResponsibleSector } from "../AutocompleteResponsibleSector";

interface JustificationDialogProps {
  open: boolean;
  onClose: () => void;
}

export function JustificationsDialog({
  open,
  onClose,
}: JustificationDialogProps) {
  const { justificationId, methods, isLoading, handleSubmit } =
    useJustificationsDialog();

  const handleClose = () => {
    methods.reset({});
    onClose();
  };

  const DialogHeader = () => {
    if (justificationId) return "Editar Justificativa";
    return "Adicionar Justificativa";
  };

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      fullWidth
      PaperProps={{
        sx: { maxWidth: "1200px" },
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
                <Grid item xs={4}>
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
                <Grid item xs={2}>
                  <AutocompleteResponsibleSector
                    name="responsibleSector.description"
                    keyCode="description"
                    onChange={(value) => {
                      methods.setValue(
                        "responsibleSectorId",
                        value?.id as string,
                      );
                      methods.setValue("responsibleSector", {
                        description: value?.description || "",
                      });
                    }}
                  />
                </Grid>
                <Grid item xs={3}>
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
  );
}
