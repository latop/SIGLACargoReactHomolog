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
import { usePositionDialog } from "./usePositionDialog";
import { ColorPicker } from "@/components/ActivityTypeDialog/components/ColorPicker";

interface PositionDialogProps {
  open: boolean;
  onClose: () => void;
}

export function PositionDialog({ open, onClose }: PositionDialogProps) {
  const { positionId, methods, isLoading, handleSubmit } = usePositionDialog();

  const handleClose = () => {
    methods.reset({});
    onClose();
  };

  const DialogHeader = () => {
    if (positionId) return "Atualizar Posição";
    return "Adicionar Posição";
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
                    name="priority"
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        error={!!error}
                        helperText={error?.message}
                        label="Prioridade"
                        variant="outlined"
                        fullWidth
                        type="number"
                        inputProps={{ min: 0 }}
                        onChange={(e) => {
                          field.onChange(Number(e.target.value));
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={9.8}>
                  <Controller
                    control={methods.control}
                    name="colorRGB"
                    render={({ field, fieldState: { error } }) => (
                      <Box>
                        <ColorPicker
                          {...field}
                          value={`#${field.value
                            .toString(16)
                            .padStart(6, "0")}`}
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>,
                          ) => {
                            const colorValue = parseInt(
                              e.target.value.replace("#", ""),
                              16,
                            );
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
