import React from "react";
import { Typography } from "@mui/material";
import {
  TimePickerProps as TimePickerBaseProps,
  TimePicker as TimePickerBase,
} from "@mui/x-date-pickers";
import styled from "@emotion/styled";
import { Dayjs } from "dayjs";
import { Ref, forwardRef } from "react";
import { red } from "@mui/material/colors";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  text-align: left;

  @media (max-width: 600px) {
    width: 100%;
  }
`;

interface TimePickerProps extends TimePickerBaseProps<Dayjs> {
  error?: string;
}

export const TimePicker = forwardRef<HTMLDivElement, TimePickerProps>(
  ({ error, ...props }, ref: Ref<HTMLDivElement>) => (
    <Container>
      <TimePickerBase ampm={false} {...props} ref={ref} />
      {!!error && (
        <Typography fontSize="12px" color={red[700]}>
          {error}
        </Typography>
      )}
    </Container>
  ),
);

TimePicker.displayName = "TimePicker";
