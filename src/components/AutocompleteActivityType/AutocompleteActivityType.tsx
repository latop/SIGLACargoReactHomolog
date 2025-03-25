/* eslint-disable prettier/prettier */
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { TextField } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import debounce from "debounce";
import { useActivityTypes } from "@/hooks/useActivityTypes";
import { ActivityType } from "@/interfaces/parameters";

export function AutocompleteActivityType({
  onChange,
  name = "activityTypeCode",
  label = "Atividade",
}: {
  onChange?: (value: ActivityType) => void;
  name?: string;
  label?: string;
}) {
  const {
    control,
    setValue,
    formState: { errors },
    watch,
  } = useFormContext();

  const { activityTypes, error } = useActivityTypes({
    pageSize: 15,
    code: watch(name),
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (_: any, value: ActivityType | null) => {
    setValue(name, value?.code || "");
    setValue("activityId", value?.id || "");
    onChange?.(value || ({} as ActivityType));
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Autocomplete
          clearOnEscape
          forcePopupIcon={false}
          options={activityTypes || []}
          loadingText="Carregando..."
          defaultValue={{ code: field.value ?? "" } as ActivityType}
          isOptionEqualToValue={(option: ActivityType, value: ActivityType) =>
            option.code === value.code
          }
          onChange={handleChange}
          noOptionsText={
            !field.value
              ? "Digite o nome do motorista"
              : !activityTypes && !error
                ? "Carregando..."
                : "Nenhum resultado encontrado"
          }
          getOptionLabel={(option: ActivityType) => option.code}
          renderInput={(params) => (
            <TextField
              {...field}
              {...params}
              sx={{
                "& .MuiInputBase-input.Mui-disabled": {
                  WebkitTextFillColor: "#000000",
                  opacity: 1,
                },
                "& .MuiInputBase-input": {
                  textTransform: "uppercase",
                },
              }}
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
