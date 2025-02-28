"use client";

import { Box, Button, CircularProgress, Grid } from "@mui/material";
import { Controller, FormProvider } from "react-hook-form";
import { AutocompleteFleetGroup } from "@/components/AutocompleteFleetGroup";
import { AutocompleteTruck } from "@/components/AutocompleteTruck";

import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";

import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "dayjs/locale/pt-br";

import DownloadIcon from "@mui/icons-material/Download";
import { useReportDynamicForm } from "@/hooks/useReportDynamicForm";
import { AutocompleteLocationGroup } from "@/components/AutocompleteLocationGroup";
import { ReportsResponse } from "@/interfaces/reports";

dayjs.extend(customParseFormat);

export function ReportDynamicForm({
  reportCode,
  parameterName,
  item,
}: {
  reportCode: string;
  parameterName: string[];
  item: ReportsResponse;
}) {
  const { methods, onSubmit, handleDownload, isFileAvailable, isLoading } =
    useReportDynamicForm(item);
  const { handleSubmit } = methods;

  const RenderField = () =>
    parameterName.map((item) => {
      switch (item) {
        case "Início":
          return (
            <Controller
              key={reportCode}
              name={"startDate"}
              control={methods.control}
              render={({ field }) => (
                <Grid item>
                  <DatePicker label={"Início"} {...field} />
                </Grid>
              )}
            />
          );
        case "Fim":
          return (
            <Controller
              key={reportCode}
              name={"endDate"}
              control={methods.control}
              render={({ field }) => (
                <Grid item>
                  <DatePicker label={"Fim"} {...field} />
                </Grid>
              )}
            />
          );
        case "Data Ref.":
        case "Dt. Ref.":
          return (
            <Controller
              key={reportCode}
              name={"refDate"}
              control={methods.control}
              render={({ field }) => (
                <Grid item>
                  <DatePicker label={"Data Ref."} {...field} />
                </Grid>
              )}
            />
          );
        case "Cód. Localidade":
          return (
            <Grid item xs={2}>
              <AutocompleteLocationGroup
                name="locationCode"
                onChange={(value) => {
                  methods.setValue("locationCode", value?.code);
                }}
              />
            </Grid>
          );
        case "Cód. Frota":
          return (
            <Grid item xs={2}>
              <AutocompleteFleetGroup name="fleetCode" />
            </Grid>
          );
        case "Placa":
          return (
            <Grid item xs={2}>
              <AutocompleteTruck
                name="licensePlate"
                onChange={(e) => {
                  methods.setValue("licensePlate", e?.licensePlate);
                }}
              />
            </Grid>
          );
        default:
          return null;
      }
    });

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            <Grid container gap={1}>
              <RenderField />
            </Grid>
          </Box>
          <Grid container gap={1} mt={1}>
            <Button
              disabled={isLoading}
              type="submit"
              variant="contained"
              color="primary"
              onClick={() => {
                methods.setValue("reportCode", reportCode);
              }}
            >
              {!isLoading ? (
                "Enviar"
              ) : (
                <CircularProgress size={"16px"} color="inherit" />
              )}
            </Button>
            {isFileAvailable && (
              <Button
                variant="contained"
                color="primary"
                sx={{
                  display: "flex",
                  gap: 0.5,
                }}
                id="downloadReport"
                onClick={() => handleDownload(reportCode)}
              >
                Baixar <DownloadIcon fontSize="inherit" />
              </Button>
            )}
          </Grid>
        </form>
      </FormProvider>
    </LocalizationProvider>
  );
}
