import { useLocationRelease } from "@/hooks/useLocationRelease";
import { Location } from "@/interfaces/trip";
import { TextField } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import debounce from "debounce";
import { Controller, useFormContext } from "react-hook-form";

export interface AutocompleteLocationReleaseProps {
  name?: string;
  label?: string;
  keyCode?: keyof Location;
}

export function AutocompleteLocationRelease({
  name = "locationCode",
  label = "Cód. localização",
  keyCode = "code",
}: AutocompleteLocationReleaseProps) {
  const {
    control,
    watch,
    setValue,
    formState: { errors, dirtyFields },
  } = useFormContext();

  const isDirty = dirtyFields[name];
  const { locations, error } = useLocationRelease({
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
          options={locations || []}
          loadingText="Carregando..."
          defaultValue={{ code: field.value || "" } as Location}
          isOptionEqualToValue={(option: Location, value: Location) =>
            option[keyCode] === value[keyCode]
          }
          onChange={(_, value) => {
            setValue(name, value?.[keyCode] || "");
          }}
          noOptionsText={
            !field.value
              ? "Digite o código"
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
              error={!!errors[field.name]}
              helperText={errors[field.name]?.message?.toString()}
            />
          )}
        />
      )}
    />
  );
}
