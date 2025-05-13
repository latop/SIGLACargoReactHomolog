/* eslint-disable prettier/prettier */
import React, { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { TextField } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import debounce from "debounce";
import { useTruck } from "@/hooks/useTruck";
import { Truck } from "@/interfaces/vehicle";

export function AutocompleteTruck({
  name = "truck",
  label = "Placa do veículo",
  keyCode = "licensePlate",
  disabled = false,
  onChange,
  isUpperCase = false,
}: {
  name?: string;
  label?: string;
  keyCode?: keyof Truck;
  disabled?: boolean;
  onChange?: (value: Truck | null) => void;
  isUpperCase?: boolean;
}) {
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext();
  const [value, setLocalValue] = useState(watch(name));

  const { trucks, error } = useTruck({
    pageSize: 10,
    licensePlate: value,
  });

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        return (
          <Autocomplete
            forcePopupIcon={false}
            disabled={disabled}
            clearOnEscape
            options={trucks || []}
            loadingText="Carregando..."
            defaultValue={
              {
                [keyCode]: field.value?.[keyCode] || field.value || "",
              } as Truck
            }
            isOptionEqualToValue={(option: Truck, value: Truck) =>
              option[keyCode] === value[keyCode]
            }
            onChange={(_, value: Truck | null) => {
              onChange && onChange(value);
            }}
            noOptionsText={
              !field.value
                ? "Digite..."
                : !trucks && !error
                ? "Carregando..."
                : "Nenhum resultado encontrado"
            }
            getOptionLabel={(option: Truck) => option[keyCode] as string}
            renderInput={(params) => (
              <TextField
                {...field}
                {...params}
                sx={{
                  "& .MuiInputBase-input.Mui-disabled": {
                    WebkitTextFillColor: "#000000",
                    opacity: 1,
                  },
                  ...(isUpperCase && {
                    "& .MuiInputBase-input": {
                      textTransform: "uppercase",
                    },
                  }),
                }}
                onChange={debounce((event) => {
                  setLocalValue(event.target.value);
                }, 300)}
                variant="outlined"
                fullWidth
                label={label}
                error={!!errors[field.name]}
                helperText={errors[field.name]?.message?.toString()}
              />
            )}
          />
        );
      }}
    />
  );
}
