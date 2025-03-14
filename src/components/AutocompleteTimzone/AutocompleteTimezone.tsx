import React, { useCallback, useLayoutEffect, useRef } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Skeleton, TextField } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { Timezone, useTimezoneQuery } from "@/services/query/parameters";

interface AutocompleteTimezoneProps {
  name?: string;
  label?: string;
  keyCode?: keyof Timezone;
  onChange?: (value: Timezone | null) => void;
  hasSkeleton?: boolean;
  hasMock?: boolean;
}

export function AutocompleteTimezone({
  name = "code",
  label = "Fuso Horário",
  keyCode = "code",
  onChange,
  hasSkeleton = false,
  hasMock = false,
}: AutocompleteTimezoneProps) {
  const isFirstRender = useRef(true);
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext();

  const {
    data: timezonesData,
    error,
    isFetching,
  } = useTimezoneQuery({
    enabled: !hasMock,
    queryKey: ["timezone"],
  });

  useLayoutEffect(() => {
    isFirstRender.current = false;
  }, []);

  const handleChange = useCallback(
    (_: unknown, value: Timezone | null) => {
      if (onChange) {
        onChange(value);
      } else {
        setValue("id", value?.id ?? "");
        setValue("code", value?.code ?? "");
      }
    },
    [onChange, setValue],
  );

  const isLoadingCondition = (!timezonesData && !error) || isFetching;
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
          options={timezonesData ?? []}
          loadingText="Carregando..."
          defaultValue={
            {
              [keyCode]: field.value?.[keyCode] || field.value || "",
            } as Timezone
          }
          isOptionEqualToValue={(option: Timezone, value: Timezone) =>
            option[keyCode] === value[keyCode]
          }
          onChange={handleChange}
          noOptionsText={
            isLoadingCondition ? "Carregando..." : "Nenhum resultado encontrado"
          }
          getOptionLabel={(option: Timezone) => option?.code}
          renderInput={(params) => (
            <TextField
              {...field}
              {...params}
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
