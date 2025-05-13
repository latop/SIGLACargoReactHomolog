/* eslint-disable prettier/prettier */
import React, { SyntheticEvent } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { TextField } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import debounce from "debounce";
import { FleetBrand } from "@/interfaces/vehicle";
import { useFleetBrand } from "@/hooks/useFleetBrand";
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  uppercaseInput: {
    textTransform: 'uppercase',
    padding: '5px',
  },
});

export function AutocompleteFleetBrand({
  name = "fleetBrandCode",
  keyCode = "code",
  onChange,
  label = "Marca de Frota",
}: {
  name?: string;
  keyCode?: keyof FleetBrand;
  onChange?: (value: FleetBrand | null) => void;
  label?: string;
}) {
  const {
    control,
    watch,
    setValue,
    formState: { errors, dirtyFields },
  } = useFormContext();

  const isDirty = dirtyFields[name];
  const { fleetBrands, error } = useFleetBrand({
    pageSize: 10,
    code: isDirty ? watch(name) : "",
  });

  const handleChange = (
    _: SyntheticEvent<Element, Event>,
    value: FleetBrand | null,
  ) => {
    if (onChange) {
      onChange(value);
    } else {
      setValue("fleetBrandCode", value?.code || "");
      setValue("fleetBrandId", value?.id || "");
    }
  };

  const classes = useStyles();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Autocomplete
          clearOnEscape
          forcePopupIcon={false}
          options={fleetBrands}
          loadingText="Carregando..."
          defaultValue={{ [keyCode]: field.value ?? "" } as FleetBrand}
          isOptionEqualToValue={(option: FleetBrand, value: FleetBrand) =>
            option[keyCode] === value[keyCode]
          }
          onChange={handleChange}
          noOptionsText={
            !field.value
              ? "Digite o código"
              : !fleetBrands && !error
                ? "Carregando..."
                : "Nenhum resultado encontrado"
          }
          getOptionLabel={(option: FleetBrand) =>
            option.name
              ? `${option.code} - ${option.name}`
              : option.code
          }
          renderInput={(params) => (
            <TextField
              {...field}
              {...params}
              inputProps={{
                ...params.inputProps,
                className: classes.uppercaseInput,
              }}
              onChange={debounce(field.onChange, 300)}
              variant="outlined"
              fullWidth
              label={label}
              error={!!errors[field.name]}
              helperText={errors[field.name]?.message?.toString()}
              value={field.value ?? ""}
            />
          )}
        />
      )}
    />
  );
} 