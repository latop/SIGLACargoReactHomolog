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
  FormControlLabel,
  Grid,
  Switch,
  TextField,
} from "@mui/material";
import { Controller, FormProvider } from "react-hook-form";
import { useCompaniesDialog } from "./useCompaniesDialog";
import { AutocompleteContries } from "../AutocompleteCountries";
import { AutocompleteStates } from "../AutocompleteStates";
import { AutocompleteRegions } from "../AutocompleteRegions";
import { AutocompleteCities } from "../AutocompleteCities";

interface CompaniesDialogProps {
  open: boolean;
  onClose: () => void;
}

export function CompaniesDialog({ open, onClose }: CompaniesDialogProps) {
  const { companyId, methods, isLoading, handleSubmit } = useCompaniesDialog();

  const handleClose = () => {
    methods.reset({});
    onClose();
  };

  const DialogHeader = () => {
    if (companyId) return "Atualizar Empresa";
    return "Adicionar Empresa";
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
                <Grid item xs={3}>
                  <Controller
                    control={methods.control}
                    name="name"
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        error={!!error}
                        helperText={error?.message}
                        label="Nome"
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
                    name="address"
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        error={!!error}
                        helperText={error?.message}
                        label="Endereço"
                        variant="outlined"
                        fullWidth
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={3}>
                  <AutocompleteContries
                    name="country.name"
                    label="País"
                    onChange={(value) => {
                      methods.setValue("countryId", value?.id || null);
                      methods.setValue("country", value || null);
                    }}
                  />
                </Grid>
                <Grid item xs={3}>
                  <AutocompleteStates
                    name="state.name"
                    label="Estado"
                    onChange={(value) => {
                      methods.setValue("stateId", value?.id || null);
                      methods.setValue("state", value || null);
                    }}
                  />
                </Grid>
                <Grid item xs={3}>
                  <AutocompleteCities
                    name="city.name"
                    label="Cidade"
                    onChange={(value) => {
                      methods.setValue("cityId", value?.id || null);
                      methods.setValue("city", value || null);
                    }}
                  />
                </Grid>
                <Grid item xs={3}>
                  <AutocompleteRegions
                    name="region.name"
                    label="Região"
                    onChange={(value) => {
                      methods.setValue("regionId", value?.id || null);
                      methods.setValue("region", value || null);
                    }}
                  />
                </Grid>
                <Grid item xs={3}>
                  <Controller
                    control={methods.control}
                    name="isSupplier"
                    render={({ field }) => (
                      <FormControlLabel
                        control={
                          <Switch
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                          />
                        }
                        label="Fornecedor"
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
