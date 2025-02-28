/* eslint-disable prettier/prettier */
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { TextField } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import debounce from "debounce";
import { Country } from "@/interfaces/parameters";
import { useCountries } from "@/hooks/useCountries";

export function AutocompleteContries({
  name = "name",
  label = "País",
  keyCode = "name",
  onChange,

}: {
  name?: string;
  label?: string;
  keyCode?: keyof Country;
  onChange?: (value: Country | null) => void;
}) {
  const {
    control,
    watch,
    setValue,
    formState: { errors, dirtyFields },
  } = useFormContext();

  const isDirty = dirtyFields[name];
  const { contries, error } = useCountries({
    code: isDirty ? watch(name) : "",
  });

  const handleChange = (_: unknown, value: Country | null) => {
    if (onChange) {
      onChange(value);
    } else {
      setValue("id", value?.id || "");
      setValue("code", value?.code || "");

    }
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Autocomplete
          forcePopupIcon={false}
          clearOnEscape
          options={contries || []}
          loadingText="Carregando..."
          defaultValue={{ name: field.value || "" } as Country}
          isOptionEqualToValue={(option: Country, value: Country) =>
            option[keyCode] === value[keyCode]
          }
          onChange={handleChange}
          noOptionsText={
            !field.value
              ? "Digite o código"
              : !contries && !error
                ? "Carregando..."
                : "Nenhum resultado encontrado"
          }
          getOptionLabel={(option: Country) => option.name}
          renderInput={(params) => (
            <TextField
              {...field}
              {...params}
              onChange={debounce(field.onChange, 300)}
              variant="outlined"
              fullWidth
              label={label}
              error={!!errors[field.name]}
              helperText={errors[field.name]?.message?.toString()}
            />
          )}
        />
      )}
    />
  );
}
