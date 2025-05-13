import React, { SyntheticEvent } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { TextField } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import debounce from "debounce";
import { LocationType } from "@/interfaces/trip";
import { useGetLocationTypeQuery } from "@/services/query/trips";

export function AutocompleteLocationType({
  name = "locationType",
  keyCode = "code",
  onChange,
  label = "Tipo da Localização",
  optionKey = "code",
}: {
  name?: string;
  keyCode?: keyof LocationType;
  onChange?: (value: LocationType | null) => void;
  label?: string;
  optionKey?: keyof LocationType;
}) {
  const {
    control,
    watch,
    setValue,
    formState: { errors, dirtyFields },
  } = useFormContext();
  const isDirty = dirtyFields[name];
  const { data: { data: fleetTypes = [] } = [], error } =
    useGetLocationTypeQuery({
      pageSize: 20,
      code: isDirty ? watch(name) : "",
    });

  const handleChange = (
    _: SyntheticEvent<Element, Event>,
    value: LocationType | null,
  ) => {
    if (onChange) {
      onChange(value);
    } else {
      setValue(name, value?.[keyCode] || "");
      setValue("locationTypeId", value?.id || "");
      setValue("locationTypeCode", value?.code || "");
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
          options={fleetTypes || []}
          loadingText="Carregando..."
          defaultValue={{ [keyCode]: field.value ?? "" } as LocationType}
          isOptionEqualToValue={(option: LocationType, value: LocationType) =>
            option.id === value.id
          }
          onChange={handleChange}
          noOptionsText={
            !field.value
              ? "Digite..."
              : !fleetTypes && !error
              ? "Carregando..."
              : "Nenhum resultado encontrado"
          }
          getOptionLabel={(option: LocationType) =>
            optionKey ? `${option[optionKey]}` : option.code
          }
          renderInput={(params) => (
            <TextField
              {...field}
              {...params}
              autoComplete="off"
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
