import React from "react";
import { Controller, useFormContext } from "react-hook-form";
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
}: {
  name?: string;
  label?: string;
  keyLabel?: keyof Company;
  keyCode?: keyof Company;
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

  return (
    <Controller
      name={name}
      control={control}
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
          onChange={(_, value) => {
            setValue(name, value?.[keyCode] || "");
          }}
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
