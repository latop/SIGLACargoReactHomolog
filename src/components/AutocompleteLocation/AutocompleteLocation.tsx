/* eslint-disable prettier/prettier */
import { Location } from "@/interfaces/trip";
import { useGetLocationReleaseQuery } from "@/services/query/trips";
import { TextField } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import debounce from "debounce";
import { SyntheticEvent } from "react";
import { Controller, useFormContext } from "react-hook-form";

export interface AutocompleteLocationProps {
  name?: string;
  label?: string;
  isRequired?: boolean;
  disabled?: boolean;
  keyCode?: keyof Location;
  onChange?: (value?: Location | null) => void;
}

export function AutocompleteLocation({
  name = "locationCode",
  label = "Cód. localização",
  keyCode = "code",
  disabled = false,
  isRequired = false,
  onChange,
}: AutocompleteLocationProps) {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const { data = [], error } = useGetLocationReleaseQuery({
    code: watch(name),
    filter1Bool: null,
  });

  const locations = data?.data || [];

  const handleChange = (
    _: SyntheticEvent<Element, Event>,
    value: Location | null,
  ) => {
    if (onChange) {
      onChange(value);
    } else {
      setValue(name, value?.[keyCode] || "");
      setValue(`${name.split(".")[0]}Id`, value?.id || "");
      setValue(name, value?.id || "");
      setValue(`${name.split(".")[0]}Description`, value?.name || "");
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Autocomplete
          forcePopupIcon={false}
          clearOnEscape
          options={locations}
          loadingText="Carregando..."
          defaultValue={{ code: field.value || "" } as Location}
          isOptionEqualToValue={(option: Location, value: Location) =>
            option.id === value.id
          }
          disabled={disabled}
          onChange={handleChange}
          noOptionsText={
            !field.value
              ? "Digite..."
              : !locations && !error
              ? "Carregando..."
              : "Nenhum resultado encontrado"
          }
          getOptionLabel={(option: Location) => option.code}
          renderInput={(params) => (
            <TextField
              {...field}
              {...params}
              onChange={debounce(field.onChange, 300)}
              variant="outlined"
              fullWidth
              label={label}
              required={isRequired}
              error={!!errors[field.name]}
              disabled={disabled}
              helperText={errors[field.name]?.message?.toString()}
              InputProps={{
                disabled,
                ...params.InputProps,
                inputProps: {
                  ...params.inputProps,

                  style: { textTransform: "uppercase" }, // Apply uppercase style
                },
              }}
            />
          )}
        />
      )}
    />
  );
}
