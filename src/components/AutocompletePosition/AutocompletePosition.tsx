/* eslint-disable prettier/prettier */
import React, { SyntheticEvent } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { TextField } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import debounce from "debounce";
import { usePosition } from "@/hooks/usePosition";
import { Position } from "@/interfaces/driver";

export function AutocompletePosition({
  name = "positionCode",
  keyCode = "code",
  onChange,
  label = "Posição",
}: {
  name?: string;
  keyCode?: keyof Position;
  onChange?: (value: Position | null) => void;
  label?: string;
}) {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const { positions, error } = usePosition({
    pageSize: 10,
    code: watch("positionCode"),
  });

  const handleChange = (
    _: SyntheticEvent<Element, Event>,
    value: Position | null,
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
          clearOnEscape
          forcePopupIcon={false}
          options={positions || []}
          loadingText="Carregando..."
          defaultValue={{ code: field.value ?? "" } as Position}
          isOptionEqualToValue={(option: Position, value: Position) =>
            option.code === value.code
          }
          onChange={handleChange}
          noOptionsText={
            !field.value
              ? "Digite..."
              : !positions && !error
              ? "Carregando..."
              : "Nenhum resultado encontrado"
          }
          getOptionLabel={(option: Position) => option.code}
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
