import { TextField, TextFieldProps } from "@mui/material";
import { forwardRef } from "react";

interface DurationFieldProps extends Omit<TextFieldProps, "onChange"> {
  onChange?: (value: string) => void;
}

export const DurationField = forwardRef<HTMLDivElement, DurationFieldProps>(
  ({ onChange, label = "Duração", ...props }, ref) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      let inputValue = event.target.value.replace(/\D/g, "");

      if (inputValue.length >= 2) {
        const hours = inputValue.substring(0, 2);
        let minutes = inputValue.substring(2, 4);
        if (minutes && parseInt(minutes) > 59) {
          minutes = "59";
        }
        inputValue = hours + ":" + minutes;
      }

      if (inputValue.length <= 5) {
        onChange?.(inputValue);
      }
    };

    return (
      <TextField
        {...props}
        ref={ref}
        inputProps={{ maxLength: 5, inputMode: "numeric" }}
        variant="outlined"
        fullWidth
        label={label}
        placeholder="hh:mm"
        onChange={handleChange}
      />
    );
  },
);

DurationField.displayName = "DurationField";
