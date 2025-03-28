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
  FormControl,
  FormControlLabel,
  Grid,
  MenuItem,
  TextField,
} from "@mui/material";
import { useActivityTypeDialog } from "./useActivityTypeDialog";
import { Controller, FormProvider } from "react-hook-form";
import { ColorPicker } from "./components/ColorPicker";
import { grey } from "@mui/material/colors";

interface ActivityTypeDialogProps {
  open: boolean;
  onClose: () => void;
}

export function ActivityTypeDialog({ open, onClose }: ActivityTypeDialogProps) {
  const { activityTypeId, methods, isLoading, handleSubmit } =
    useActivityTypeDialog();

  const handleClose = () => {
    methods.reset({});
    onClose();
  };

  const DialogHeader = () => {
    if (activityTypeId) return "Atualizar Tipo de Atividade";
    return "Adicionar Tipo de Atividade";
  };

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      fullWidth
      PaperProps={{
        sx: { maxWidth: "1000px", height: "290px", overflowY: "hidden" },
      }}
    >
      <FormProvider {...methods}>
        <form
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            overflowY: "hidden",
          }}
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
                    <Controller
                      control={methods.control}
                      name="function"
                      render={({ field, fieldState: { error } }) => (
                        <FormControl>
                          <TextField
                            select
                            label="Função"
                            sx={{ minWidth: 154 }}
                            {...field}
                            error={!!error}
                            helperText={error?.message}
                            value={field.value?.toLocaleUpperCase()}
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(value);
                            }}
                          >
                            <MenuItem value="AFASTADO">AFASTADO</MenuItem>
                            <MenuItem value="FOLGA">FOLGA</MenuItem>
                            <MenuItem value="JORNADA">JORNADA</MenuItem>
                            <MenuItem value="TREINAMENTO">TREINAMENTO</MenuItem>
                          </TextField>
                        </FormControl>
                      )}
                    />
                  </Grid>

                  <Grid
                    item
                    xs={1.5}
                    sx={{ display: "flex", alignItems: "center", gap: "24px" }}
                  >
                    <Controller
                      control={methods.control}
                      name={"flgJourney"}
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
                            label="Jornada"
                          />
                        );
                      }}
                    />
                    <Controller
                      control={methods.control}
                      name={"flgPayroll"}
                      render={({ field }) => {
                        return (
                          <FormControlLabel
                            componentsProps={{
                              typography: {
                                sx: {
                                  fontSize: "12px",
                                  color: grey[600],
                                  width: "120px",
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
                            label="Folha de Pagamento"
                          />
                        );
                      }}
                    />
                    <Controller
                      control={methods.control}
                      name={"color"}
                      render={({ field }) => <ColorPicker {...field} />}
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
