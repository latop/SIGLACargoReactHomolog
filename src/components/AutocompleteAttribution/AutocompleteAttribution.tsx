/* eslint-disable prettier/prettier */
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { TextField } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import debounce from "debounce";
import { useAttribution } from "@/hooks/useAttribution";
import { Attribution } from "@/interfaces/parameters";

export function AutocompleteAttribution({
  name = "attributionId",
  label = "Cód. da Atribuicão",
  keyCode = "id",
  onChange,
}: {
  name?: string;
  label?: string;
  keyCode?: keyof Attribution;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange?: (value: any) => void;
}) {
  const {
    control,
    watch,
    setValue,
    formState: { errors, dirtyFields },
  } = useFormContext();

  const isDirty = dirtyFields[name];

  const { attribution, error } = useAttribution({
    pageSize: 10,
    code: isDirty ? watch(name) : "",
  });

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Autocomplete
          forcePopupIcon={false}
          clearOnEscape
          options={(attribution as Attribution[]) || []}
          loadingText="Carregando..."
          defaultValue={{ code: field.value || "" } as Attribution}
          isOptionEqualToValue={(option: Attribution, value: Attribution) =>
            option[keyCode] === value[keyCode]
          }
          onChange={(_, value) => {
            setValue(name, value?.[keyCode] || "");
            onChange?.(value);
          }}
          noOptionsText={
            !field.value
              ? "Digite o código"
              : !attribution && !error
                ? "Carregando..."
                : "Nenhum resultado encontrado"
          }
          getOptionLabel={(option: Attribution) => option.code}
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
