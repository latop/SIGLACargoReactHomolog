import React, { SyntheticEvent } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { TextField } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import debounce from "debounce";
import { FleetGroup } from "@/interfaces/vehicle";
import { useGetFleetGroupQuery } from "@/services/query/vehicles";

export function AutocompleteFleetGroup({
  name = "fleetGroupCode",
  keyCode = "code",
  onChange,
}: {
  name?: string;
  keyCode?: keyof FleetGroup;
  onChange?: (value: FleetGroup | null) => void;
}) {
  const {
    control,
    watch,
    setValue,
    formState: { errors, dirtyFields },
  } = useFormContext();

  const isDirty = dirtyFields[name];

  const { data: { data: fleetGroups = [] } = [], error } =
    useGetFleetGroupQuery({
      pageSize: 20,
      code: isDirty ? watch(name) : "",
    });

  const handleChange = (
    _: SyntheticEvent<Element, Event>,
    value: FleetGroup | null,
  ) => {
    if (onChange) {
      onChange(value);
    } else {
      setValue(name, value?.[keyCode] || "");
      setValue("fleetGroupId", value?.id || "");
      setValue("fleetGroupCode", value?.code || "");
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
          options={fleetGroups || []}
          loadingText="Carregando..."
          defaultValue={{ [keyCode]: field.value ?? null } as FleetGroup}
          isOptionEqualToValue={(option: FleetGroup, value: FleetGroup) =>
            option.id === value.id
          }
          onChange={handleChange}
          noOptionsText={
            !field.value
              ? "Digite o código"
              : !fleetGroups && !error
              ? "Carregando..."
              : "Nenhum resultado encontrado"
          }
          getOptionLabel={(option: FleetGroup) =>
            option.description
              ? `${option.code} - ${option.description}`
              : option.code
          }
          renderInput={(params) => (
            <TextField
              {...field}
              {...params}
              autoComplete="off"
              onChange={debounce(field.onChange, 300)}
              variant="outlined"
              fullWidth
              label="Cód da frota"
              error={!!errors[field.name]}
              helperText={errors[field.name]?.message?.toString()}
            />
          )}
        />
      )}
    />
  );
}
