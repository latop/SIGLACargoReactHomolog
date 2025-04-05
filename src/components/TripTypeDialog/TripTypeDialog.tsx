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
import { Controller, FormProvider } from "react-hook-form";
import { useTripTypeDialog } from "./useTripTypeDialog";
import { ColorPicker } from "../ActivityTypeDialog/components/ColorPicker";
import { grey } from "@mui/material/colors";

export function TripTypeDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { tripTypeId, methods, isLoading, handleSubmit } = useTripTypeDialog();

  const handleClose = () => {
    methods.reset({});
    onClose();
  };

  const DialogHeader = () => {
    return tripTypeId ? "Atualizar Tipo de Viagem" : "Adicionar Tipo de Viagem";
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
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            <Box display="flex" justifyContent="space-between">
              <DialogHeader />
              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
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
                <Grid item xs={3}>
                  <Controller
                    control={methods.control}
                    name="code"
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        error={!!error}
                        helperText={error?.message}
                        label="Código de Viagem"
                        variant="outlined"
                        fullWidth
                        onChange={(e) => {
                          field.onChange(e.target.value.toUpperCase());
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
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
                <Grid container xs={6}>
                  <Grid item xs={2}>
                    <Controller
                      control={methods.control}
                      name={"colorRGB"}
                      render={({ field }) => {
                        return <ColorPicker {...field} />;
                      }}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <Controller
                      control={methods.control}
                      name={"isLoaded"}
                      render={({ field }) => (
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
                            alignItems: "flex-start",
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
                          label="Tem carga"
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
  );
}
