/* eslint-disable prettier/prettier */
import React, { useCallback, useLayoutEffect, useRef } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Skeleton, TextField } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import debounce from "debounce";
import { City } from "@/interfaces/parameters";
import { useCities } from "@/hooks/useCities";
interface AutocompleteCitiesProps {
  name?: string;
  label?: string;
  keyCode?: keyof City;
  onChange?: (value: City | null) => void;
  hasSkeleton?: boolean;
}

export function AutocompleteCities({
  name = "name",
  label = "Cidades",
  keyCode = "name",
  onChange,
  hasSkeleton = false,
}: AutocompleteCitiesProps) {
  const isFirstRender = useRef(true);
  const {
    control,
    watch,
    setValue,
    formState: { errors, dirtyFields },
  } = useFormContext();

  const isDirty = dirtyFields[name] || name.includes("city");

  const {
    cities,
    error,
    isLoading: isFetching,
  } = useCities({
    cityName: isDirty ? watch(name) : "",
  });

  useLayoutEffect(() => {
    isFirstRender.current = false;
  }, []);

  const handleChange = useCallback(
    (_: unknown, value: City | null) => {
      if (onChange) {
        onChange(value);
      } else {
        setValue("id", value?.id ?? "");
        setValue("code", value?.code ?? "");
      }
    },
    [onChange, setValue],
  );

  const isLoadingCondition = (!cities && !error) || isFetching;
  const showSkeleton = hasSkeleton && isFetching && isFirstRender.current;

  if (showSkeleton) return <Skeleton width="100%" height="100%" />;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Autocomplete
          forcePopupIcon={false}
          clearOnEscape
          options={cities ?? []}
          loadingText="Carregando..."
          defaultValue={
            { [keyCode]: field.value?.[keyCode] || field.value || "" } as City
          }
          isOptionEqualToValue={(option: City, value: City) =>
            option[keyCode] === value[keyCode]
          }
          onChange={handleChange}
          noOptionsText={
            isLoadingCondition
              ? "Carregando..."
              : !field.value
              ? "Digite..."
              : "Nenhum resultado encontrado"
          }
          getOptionLabel={(option: City) => option?.name}
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
              inputProps={{
                ...params.inputProps,
                style: {
                  textTransform: "uppercase",
                },
              }}
            />
          )}
        />
      )}
    />
  );
}
