import { Box, FormLabel, Input, InputProps, styled } from "@mui/material";
import { grey } from "@mui/material/colors";
import React, { forwardRef } from "react";

interface ColorCircleProps {
  color: string;
}

interface ColorPickerProps extends Omit<InputProps, "type"> {
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ColorInput = styled(Input)`
  visibility: hidden;
  position: absolute;
  width: 0;
  height: 0;
  padding: 0;
  margin: 0;
  border: 0;
  outline: 0;
  z-index: -1;
`;

const ColorCircle = styled("div")<ColorCircleProps>(({ color }) => ({
  width: 20,
  height: 20,
  borderRadius: "50%",
  backgroundColor: color,
  border: `1px solid ${grey[300]}`,
}));

export const ColorPicker = forwardRef<HTMLInputElement, ColorPickerProps>(
  ({ onChange, value, ...props }, ref) => {
    const [color, setColor] = React.useState(value);
    const handleColorChange = React.useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        setColor(() => {
          onChange?.(event);
          return event.target.value;
        });
      },
      [onChange],
    );

    return (
      <Box>
        <FormLabel
          sx={{
            fontSize: "12px",
            color: grey[600],
            width: "120px",
            cursor: "pointer",
          }}
        >
          Cor
          <ColorCircle color={color || "#000000"} />
          <ColorInput
            ref={ref}
            type="color"
            value={value}
            onChange={handleColorChange}
            {...props}
          />
        </FormLabel>
      </Box>
    );
  },
);

ColorPicker.displayName = "ColorPicker";
