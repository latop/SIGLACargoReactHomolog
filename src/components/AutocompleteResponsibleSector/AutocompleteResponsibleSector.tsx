/* eslint-disable prettier/prettier */
import React, { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { TextField } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import debounce from "debounce";
import { useResponsibleSector } from "@/hooks/useResponsibleSector";
import { ResponsibleSectorType } from "@/interfaces/parameters";

export function AutocompleteResponsibleSector({
  name = "responsibleSector",
  label = "Setor Responsável",
  keyCode = "code",
  disabled = false,
  onChange,
}: {
  name?: string;
  keyCode?: keyof ResponsibleSectorType;
  label?: string;
  disabled?: boolean;
  onChange?: (value: ResponsibleSectorType | null) => void;
}) {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();
  const [, setLocalValue] = useState(watch(name));

  const { responsibleSectors, error } = useResponsibleSector({
    pageNumber: 0,
    pageSize: 0,
  });
  console.log(errors);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (_: any, value: ResponsibleSectorType | null) => {
    if (onChange) {
      onChange(value);
    } else {
      setValue("code", value?.code || "");
      setValue("description", value?.description || "");
      setValue("id", value?.id || "");
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Autocomplete
          clearOnEscape
          disabled={disabled}
          forcePopupIcon={false}
          options={responsibleSectors || []}
          loadingText="Carregando..."
          defaultValue={
            { [keyCode]: field.value ?? "" } as ResponsibleSectorType
          }
          isOptionEqualToValue={(
            option: ResponsibleSectorType,
            value: ResponsibleSectorType,
          ) => option[keyCode] === value[keyCode]}
          onChange={handleChange}
          noOptionsText={
            !field.value
              ? "Digite..."
              : !responsibleSectors && !error
              ? "Carregando..."
              : "Nenhum resultado encontrado"
          }
          getOptionLabel={(option: ResponsibleSectorType) => option.description}
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
              onChange={debounce((e) => {
                setLocalValue(e.target.value);
              }, 300)}
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
