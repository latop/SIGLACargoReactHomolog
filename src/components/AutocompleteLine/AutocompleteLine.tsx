/* eslint-disable prettier/prettier */
import { Line } from "@/interfaces/daily-trip";
import { useGetLinesQuery } from "@/services/query/trips";
import { TextField } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import debounce from "debounce";
import { Controller, useFormContext } from "react-hook-form";

export function AutocompleteLine({
  name = "lineCode",
  label = "Cód. da rota",
  isRequired = false,
  keyCode = "code",
  onChange,
}: {
  name?: string;
  label?: string;
  keyCode?: keyof Line;
  isRequired?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange?: (value: any) => void;
}) {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext();

  const { data: lines, error } = useGetLinesQuery({})

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Autocomplete
          forcePopupIcon={false}
          clearOnEscape
          options={(lines?.data as Line[]) || []}
          loadingText="Carregando..."
          defaultValue={{ code: field.value || "" } as Line}
          isOptionEqualToValue={(option: Line, value: Line) =>
            option[keyCode] === value[keyCode]
          }
          onChange={(_, value) => {
            setValue(name, value?.[keyCode] || "");
            onChange?.(value);
          }}
          noOptionsText={
            !field.value
              ? "Digite o código"
              : !lines && !error
                ? "Carregando..."
                : "Nenhum resultado encontrado"
          }
          getOptionLabel={(option: Line) => option.code}
          renderInput={(params) => (
            <TextField
              {...field}
              {...params}
              onChange={debounce(field.onChange, 300)}
              variant="outlined"
              fullWidth
              required={isRequired}
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
