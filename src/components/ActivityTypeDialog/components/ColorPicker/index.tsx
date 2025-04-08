import { Box, FormLabel, Input, InputProps, styled } from "@mui/material";
import { grey } from "@mui/material/colors";
import React, { forwardRef } from "react";

interface ColorCircleProps {
  color: string;
}

interface ColorPickerProps extends InputProps {}

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

export const ColorPicker = forwardRef<HTMLInputElement>(
  ({ onChange, ...props }: ColorPickerProps, ref) => {
    const [color, setColor] = React.useState(props.value as string);
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
          <ColorCircle color={color} />
          <ColorInput
            ref={ref}
            type="color"
            onChange={handleColorChange}
            {...props}
          />
        </FormLabel>
      </Box>
    );
  },
);

ColorPicker.displayName = "ColorPicker";
