import React, { useCallback } from "react";
import { Controller, useFormContext, RegisterOptions } from "react-hook-form";
import { TextField } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { useCompany } from "@/hooks/useCompany";
import debounce from "debounce";
import { Company } from "@/interfaces/parameters";

export function AutocompleteCompany({
  name = "companyCode",
  label = "Transportadora",
  keyLabel = "code",
  keyCode = "code",
  rules,
  onChange,
}: {
  name?: string;
  label?: string;
  keyLabel?: keyof Company;
  keyCode?: keyof Company;
  rules?: RegisterOptions;
  onChange?: (value: Company | null) => void;
}) {
  const {
    control,
    watch,
    setValue,
    formState: { errors, dirtyFields },
  } = useFormContext();

  const isDirty = dirtyFields[name];
  const { companies, error } = useCompany({
    pageSize: 10,
    code: isDirty ? watch(name) : "",
  });

  const handleChange = useCallback(
    (_: unknown, value: Company | null) => {
      if (onChange) {
        onChange(value);
      } else {
        setValue(name, value?.[keyCode] ?? "");
        setValue("companyId", value?.id ?? "");
      }
    },
    [onChange, setValue],
  );

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => (
        <Autocomplete
          forcePopupIcon={false}
          clearOnEscape
          options={companies || []}
          loadingText="Carregando..."
          defaultValue={{ code: field.value || "" } as Company}
          isOptionEqualToValue={(option: Company, value: Company) =>
            option[keyCode] === value[keyCode]
          }
          onChange={handleChange}
          noOptionsText={
            !field.value
              ? "Digite o código"
              : !companies && !error
              ? "Carregando..."
              : "Nenhum resultado encontrado"
          }
          getOptionLabel={(option: Company) =>
            (option[keyLabel] || "") as string
          }
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
