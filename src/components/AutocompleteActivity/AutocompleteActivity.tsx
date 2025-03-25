import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { TextField } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import debounce from "debounce";
import { useActivities } from "@/hooks/useActivities";
import { Activity } from "@/interfaces/parameters";

export function AutocompleteActivity({
  onChange,
  name = "activityCode",
  label = "Atividade",
}: {
  onChange?: (value: Activity) => void;
  name?: string;
  label?: string;
}) {
  const {
    control,
    setValue,
    formState: { errors },
    watch,
  } = useFormContext();

  const { activities, error } = useActivities({
    pageSize: 10,
    code: watch(name),
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (_: any, value: Activity | null) => {
    setValue(name, value?.code || "");
    setValue("activityId", value?.id || "");
    onChange?.(value || ({} as Activity));
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Autocomplete
          clearOnEscape
          forcePopupIcon={false}
          options={activities || []}
          loadingText="Carregando..."
          defaultValue={{ code: field.value ?? "" } as Activity}
          isOptionEqualToValue={(option: Activity, value: Activity) =>
            option.code === value.code
          }
          onChange={handleChange}
          noOptionsText={
            !field.value
              ? "Digite o nome do motorista"
              : !activities && !error
              ? "Carregando..."
              : "Nenhum resultado encontrado"
          }
          getOptionLabel={(option: Activity) => option.code}
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
