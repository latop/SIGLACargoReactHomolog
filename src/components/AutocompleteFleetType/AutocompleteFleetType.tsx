import React, { SyntheticEvent } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Skeleton, TextField } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import debounce from "debounce";
import { FleetType } from "@/interfaces/vehicle";
import { useGetFleetTypeQuery } from "@/services/query/vehicles";

export function AutocompleteFleetType({
  name = "fleetGroupType",
  keyCode = "code",
  onChange,
  label = "Cód da frota",
  hasSkeleton = false,
}: {
  name?: string;
  keyCode?: keyof FleetType;
  onChange?: (value: FleetType | null) => void;
  label?: string;
  hasSkeleton?: boolean;
}) {
  const {
    control,
    watch,
    setValue,
    formState: { errors, dirtyFields },
  } = useFormContext();
  const isDirty = dirtyFields[name];

  const {
    data: { data: fleetTypes = [] } = [],
    error,
    isFetching,
  } = useGetFleetTypeQuery({
    pageSize: 20,
    code: isDirty ? watch(name) : "",
  });

  const handleChange = (
    _: SyntheticEvent<Element, Event>,
    value: FleetType | null,
  ) => {
    if (onChange) {
      onChange(value);
    } else {
      setValue(name, value?.[keyCode] || "");
      setValue("fleetTypeId", value?.id || "");
      setValue("fleetTypeCode", value?.code || "");
    }
  };

  if (isFetching && hasSkeleton)
    return <Skeleton width={"100%"} height={"100%"} />;

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
          defaultValue={{ [keyCode]: field.value ?? "" } as FleetType}
          isOptionEqualToValue={(option: FleetType, value: FleetType) =>
            option.id === value.id
          }
          onChange={handleChange}
          noOptionsText={
            !field.value
              ? "Digite o código"
              : !fleetTypes && !error
              ? "Carregando..."
              : "Nenhum resultado encontrado"
          }
          getOptionLabel={(option: FleetType) =>
            option.description ? `${option.code}` : option.code
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
