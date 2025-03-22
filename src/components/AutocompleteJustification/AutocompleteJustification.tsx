import {
  JustificationResponse,
  Timezone,
  useJustificationQuery,
} from "@/services/query/parameters";
import { Skeleton, TextField } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { useCallback } from "react";
import { Controller, useFormContext } from "react-hook-form";

interface Params {
  name?: string;
  label?: string;
  keyCode?: keyof JustificationResponse;
  onChange?: (value: JustificationResponse | null) => void;
  hasSkeleton?: boolean;
  hasMock?: boolean;
}

export function AutocompleteJustification({
  name = "justificativa",
  label = "Justificativa",
  keyCode = "code",
  onChange,
}: Params) {
  const { data, isLoading } = useJustificationQuery();

  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext();

  const handleChange = useCallback(
    (_: unknown, value: JustificationResponse | null) => {
      if (onChange) {
        onChange(value);
      } else {
        setValue("justificationId", value?.id ?? "");
      }
    },
    [onChange, setValue],
  );

  const showSkeleton = isLoading;

  if (showSkeleton) return <Skeleton width="100%" height="100%" />;
  console.log(errors);
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Autocomplete
          forcePopupIcon={false}
          clearOnEscape
          options={data ?? []}
          loadingText="Carregando..."
          defaultValue={
            {
              [keyCode]: field.value?.[keyCode] || field.value || "",
            } as JustificationResponse
          }
          isOptionEqualToValue={(
            option: JustificationResponse,
            value: JustificationResponse,
          ) => option[keyCode] === value[keyCode]}
          onChange={handleChange}
          noOptionsText={
            isLoading ? "Carregando..." : "Nenhum resultado encontrado"
          }
          getOptionLabel={(option: Timezone) => option?.code}
          renderInput={(params) => (
            <TextField
              {...field}
              {...params}
              variant="outlined"
              fullWidth
              label={label}
              error={errors[name] !== undefined}
              helperText={errors?.message?.toString()}
            />
          )}
        />
      )}
    />
  );
}
