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
  FormControlLabel,
  Switch,
} from "@mui/material";
import { Controller, FormProvider } from "react-hook-form";
import { useActivityTruckDialog } from "./useActivityTruckDialog";
import { ColorPicker } from "@/components/ActivityTypeDialog/components/ColorPicker";

interface ActivityTruckDialogProps {
  open: boolean;
  onClose: () => void;
}

export function ActivityTruckDialog({
  open,
  onClose,
}: ActivityTruckDialogProps) {
  const { activityTruckId, methods, isLoading, handleSubmit } =
    useActivityTruckDialog();

  const handleClose = () => {
    methods.reset({});
    onClose();
  };

  const DialogHeader = () => {
    if (activityTruckId) return "Atualizar Atividade de Caminhão";
    return "Adicionar Atividade de Caminhão";
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
                <Grid item xs={2}>
                  <Controller
                    control={methods.control}
                    name="flgDriverRequired"
                    render={({ field }) => (
                      <FormControlLabel
                        control={
                          <Switch
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                          />
                        }
                        label="Motorista Requerido"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={9.8}>
                  <Controller
                    control={methods.control}
                    name="color"
                    render={({ field, fieldState: { error } }) => (
                      <Box>
                        <ColorPicker
                          {...field}
                          value={`#${field.value}`}
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>,
                          ) => {
                            const colorValue = e.target.value.replace("#", "");
                            field.onChange(colorValue);
                          }}
                        />
                        {error && (
                          <Box color="error.main" fontSize="0.75rem" mt={0.5}>
                            {error.message}
                          </Box>
                        )}
                      </Box>
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
