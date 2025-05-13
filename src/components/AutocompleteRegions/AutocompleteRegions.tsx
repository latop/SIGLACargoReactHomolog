"use client";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { TextField } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import debounce from "debounce";
import { Region } from "@/interfaces/parameters";
import { useRegions } from "@/hooks/useRegions/useRegions";

export function AutocompleteRegions({
  name = "name",
  label = "Região",
  keyCode = "name",
  onChange,
}: {
  name?: string;
  label?: string;
  keyCode?: keyof Region;
  onChange?: (value: Region | null) => void;
}) {
  const {
    control,
    watch,
    setValue,
    formState: { errors, dirtyFields },
  } = useFormContext();

  const isDirty = dirtyFields[name];
  const { regions, error } = useRegions({
    regionName: isDirty ? watch(name) : "",
  });

  const handleChange = (_: unknown, value: Region | null) => {
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
          options={regions || []}
          loadingText="Carregando..."
          defaultValue={{ name: field.value || "" } as Region}
          isOptionEqualToValue={(option: Region, value: Region) =>
            option[keyCode] === value[keyCode]
          }
          onChange={handleChange}
          noOptionsText={
            !field.value
              ? "Digite..."
              : !regions && !error
              ? "Carregando..."
              : "Nenhum resultado encontrado"
          }
          getOptionLabel={(option: Region) => option.name}
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
