import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { render, screen } from "@testing-library/react";
import { DatePicker } from "./DatePicker";

describe("DatePicker", () => {
  it("renders the DatePickerBase component", () => {
    render(
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker label="Test Date" />)
      </LocalizationProvider>,
    );
    expect(screen.getByLabelText(/test date/i)).toBeTruthy();
  });

  it("displays an error message when there is an error", () => {
    const errorMessage = "Invalid date";
    render(
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker label="Test Date" error={errorMessage} />
      </LocalizationProvider>,
    );
    expect(screen.getByText(errorMessage)).toBeTruthy();
  });

  it("does not display an error message when there is no error", () => {
    render(
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker label="Test Date" />
      </LocalizationProvider>,
    );
    expect(screen.queryByText(/invalid date/i)).not.toBeTruthy();
  });
});
