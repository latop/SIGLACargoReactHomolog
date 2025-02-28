/* eslint-disable prettier/prettier */
import React, { SyntheticEvent, useLayoutEffect, useRef } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Skeleton, TextField } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import debounce from "debounce";
import { LocationGroup } from "@/interfaces/trip";
import { useLocationGroupQuery } from "@/hooks/useLocationGroup/useLocationGroupQuery";
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  uppercaseInput: {
    textTransform: 'uppercase',
    padding: '5px',
  },
});

export function AutocompleteLocationGroup({
  name = "locationGroupCode",
  keyCode = "code",
  onChange,
  label = "Cód da localização",
  hasSkeleton = false,
}: {
  name?: string;
  keyCode?: keyof LocationGroup;
  onChange?: (value: LocationGroup | null) => void;
  label?: string;
  hasSkeleton?: boolean;

}) {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();
  const isFirstRender = useRef(true);
  const { data: locationGroups = [], error, isFetching } = useLocationGroupQuery({
    pageSize: 10,
    code: watch(name),
  }, {
    queryKey: ["locationGroups", { code: watch(name) }],
    staleTime: 0
  });

  const handleChange = (
    _: SyntheticEvent<Element, Event>,
    value: LocationGroup | null,
  ) => {
    if (onChange) {
      onChange(value);
    } else {
      setValue("locationGroupCode", value?.code || "");
    }
  };

  const classes = useStyles();

  useLayoutEffect(() => {
    isFirstRender.current = false;
  }, []);

  const showSkeleton = hasSkeleton && isFetching && isFirstRender.current;
  
  if (showSkeleton) {
    return <Skeleton width={"100%"} height={"100%"} />;
  }

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Autocomplete
          clearOnEscape
          forcePopupIcon={false}
          options={locationGroups as LocationGroup[] || []}
          loadingText="Carregando..."
          defaultValue={{ [keyCode]: field.value ?? "" } as LocationGroup}
          isOptionEqualToValue={(option: LocationGroup, value: LocationGroup) =>
            option[keyCode] === value[keyCode]
          }
          onChange={handleChange}
          noOptionsText={
            !field.value
              ? "Digite o código"
              : !locationGroups && !error
                ? "Carregando..."
                : "Nenhum resultado encontrado"
          }
          getOptionLabel={(option: LocationGroup) =>
            option.description
              ? `${option.code} - ${option.description}`
              : option.code
          }
          renderInput={(params) => (
            <TextField
              {...field}
              {...params}
              inputProps={{
                ...params.inputProps,
                className: classes.uppercaseInput,
              }}
              onChange={debounce(field.onChange, 300)}
              variant="outlined"
              fullWidth
              label={label}
              error={!!errors[field.name]}
              helperText={errors[field.name]?.message?.toString()}
              value={field.value ?? ""}
            />
          )}
        />
      )}
    />
  );
}
