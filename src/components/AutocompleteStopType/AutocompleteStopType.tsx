/* eslint-disable prettier/prettier */
import React, { SyntheticEvent } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { TextField } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import debounce from "debounce";
import { StopType } from "@/interfaces/trip";
import { useStopType } from "@/hooks/useStopType";

export function AutocompleteStopType({
  name = "stopType",
  label = "Tipo de parada",
  keyCode = "stopTypeCode",
  onChange,
}: {
  name?: string;
  label?: string;
  keyCode?: keyof StopType;
  onChange?: (value: StopType | null) => void;
}) {
  const {
    control,
    watch,
    setValue,
    formState: { errors, dirtyFields },
  } = useFormContext();

  const isDirty = dirtyFields[name];
  const { stopTypes, error } = useStopType({
    pageSize: 10,
    code: isDirty ? watch(name) : "",
  });

  const handleChange = (
    _: SyntheticEvent<Element, Event>,
    value: StopType | null,
  ) => {
    if (onChange) {
      onChange(value);
    } else {
      setValue(name, value?.[keyCode] || "");
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
          options={stopTypes || []}
          loadingText="Carregando..."
          defaultValue={{ stopTypeCode: field.value || "" } as StopType}
          isOptionEqualToValue={(option: StopType, value: StopType) =>
            option[keyCode] === value[keyCode]
          }
          onChange={handleChange}
          noOptionsText={
            !field.value
              ? "Digite..."
              : !stopTypes && !error
              ? "Carregando..."
              : "Nenhum resultado encontrado"
          }
          getOptionLabel={(option: StopType) => option.stopTypeCode}
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
