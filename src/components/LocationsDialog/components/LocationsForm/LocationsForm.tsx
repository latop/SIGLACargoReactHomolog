import React from "react";
import { Box, Button, Grid, TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { AutocompleteLocationGroup } from "@/components/AutocompleteLocationGroup";
import { LocationFormType } from "../../useLocationsDialog";
import { AutocompleteCities } from "@/components/AutocompleteCities";
import { AutocompleteLocationType } from "@/components/AutocompleteLocationType";
import MapIcon from "@mui/icons-material/Map";
import { AutocompleteTimezone } from "@/components/AutocompleteTimzone/AutocompleteTimezone";

export const LocationsForm = () => {
  const methods = useFormContext<LocationFormType>();

  const getCoordinates = () => {
    return `https://www.google.com/maps?q=${methods.watch(
      "latitude",
    )},${methods.watch("longitude")}`;
  };

  const handleOpenWindow = () => {
    window.open(getCoordinates(), "_blank");
  };

  const hasCoordinates = () => {
    const latitude = methods.watch("latitude");
    const longitude = methods.watch("longitude");
    return Boolean(latitude && longitude);
  };

  return (
    <Box display="flex" flexDirection="column" gap="16px" mt="5px">
      <Grid container spacing={1}>
        <Grid item xs={3}>
          <Controller
            control={methods.control}
            name={"code"}
            render={({ field, fieldState: { error } }) => {
              return (
                <TextField
                  {...field}
                  error={!!error}
                  helperText={error?.message}
                  label="Cód. Da Localização"
                  variant="outlined"
                  fullWidth
                  onChange={(e) => {
                    field.onChange(e.target.value.toUpperCase());
                  }}
                />
              );
            }}
          />
        </Grid>
        <Grid item xs={9}>
          <Controller
            control={methods.control}
            name={"name"}
            render={({ field, fieldState: { error } }) => {
              return (
                <TextField
                  error={!!error}
                  helperText={error?.message}
                  {...field}
                  label="Descrição" // Nome da localização
                  variant="outlined"
                  fullWidth
                  onChange={(e) => {
                    field.onChange(e.target.value.toUpperCase());
                  }}
                />
              );
            }}
          />
        </Grid>
      </Grid>
      <Grid container spacing={1}>
        <Grid item xs={3}>
          <Controller
            control={methods.control}
            name={"codeIntegration1"}
            render={({ field, fieldState: { error } }) => {
              return (
                <TextField
                  error={!!error}
                  helperText={error?.message}
                  {...field}
                  label="Cód. GPS"
                  variant="outlined"
                  fullWidth
                />
              );
            }}
          />
        </Grid>
        <Grid item xs={3}>
          <Controller
            control={methods.control}
            name={"codeIntegration2"}
            render={({ field, fieldState: { error } }) => {
              return (
                <TextField
                  error={!!error}
                  helperText={error?.message}
                  {...field}
                  label="Cód. TMS"
                  variant="outlined"
                  fullWidth
                />
              );
            }}
          />
        </Grid>
        <Grid item xs={3}>
          <AutocompleteTimezone
            hasSkeleton
            label="Fuso Horário"
            name="timezone.code"
            onChange={(value) => {
              methods.setValue("timezoneId", value?.id || "");
            }}
          />
        </Grid>
        <Grid item xs={3}>
          <AutocompleteLocationGroup
            label="Grupo de Localização"
            name="locationGroup.code"
            hasSkeleton
            onChange={(value) => {
              methods.setValue("locationGroupId", value?.id || null);
              methods.setValue("locationGroup", value || {});
            }}
          />
        </Grid>
      </Grid>
      <Grid container spacing={1}>
        <Grid item xs={3}>
          <AutocompleteLocationType
            key={methods.watch("locationTypeId")}
            name="locationType.description"
            keyCode="description"
            label="Tipo de Localização"
            optionKey="description"
            onChange={(value) => {
              methods.setValue("locationTypeId", value?.id || "");
              methods.setValue("locationType", value || {});
            }}
          />
        </Grid>
        <Grid item xs={3}>
          <AutocompleteCities
            hasSkeleton
            label="Cidade"
            name="city"
            onChange={(value) => {
              methods.setValue("city", value || {});
              methods.setValue("cityId", value?.id || "");
            }}
          />
        </Grid>
        <Grid item xs={1.5}>
          <Controller
            control={methods.control}
            name={"latitude"}
            render={({ field, fieldState: { error } }) => {
              return (
                <TextField
                  error={!!error}
                  helperText={error?.message}
                  {...field}
                  label="Latitude"
                  variant="outlined"
                  fullWidth
                />
              );
            }}
          />
        </Grid>
        <Grid item xs={1.5}>
          <Controller
            control={methods.control}
            name={"longitude"}
            render={({ field, fieldState: { error } }) => {
              return (
                <TextField
                  error={!!error}
                  helperText={error?.message}
                  {...field}
                  label="Longitude"
                  variant="outlined"
                  fullWidth
                />
              );
            }}
          />
        </Grid>
        <Grid item xs={1} alignSelf={"center"}>
          <Button
            disabled={!hasCoordinates()}
            onClick={handleOpenWindow}
            size="small"
            variant="text"
            sx={{
              padding: "0px",
            }}
          >
            <MapIcon />
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};
