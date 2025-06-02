import React, { useMemo } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import {
  CircularProgress,
  Box,
  TextField,
  Grid,
  FormControlLabel,
  Checkbox,
  Typography,
  Chip,
  colors,
} from "@mui/material";
import { Controller, FormProvider } from "react-hook-form";
import { LineSection, useUpdateLineDialog } from "./useUpdateLineDialog";
import { UpdateLineFormFooter } from "./components/UpdateLineFormFooter";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "dayjs/locale/pt-br";
import { AutocompleteFleetGroup } from "@/components/AutocompleteFleetGroup";
import { AutocompleteLocation } from "@/components/AutocompleteLocation";
import { AutocompleteTripType } from "@/components/AutocompleteTripType";
import { DatePicker } from "@mui/x-date-pickers";
import { UpdateLineSectionForm } from "./components/UpdateLineSectionForm";

dayjs.extend(customParseFormat);

const daysOfWeek = [
  { field: "freqMon", headerName: "Seg" },
  { field: "freqTue", headerName: "Ter" },
  { field: "freqWed", headerName: "Qua" },
  { field: "freqThu", headerName: "Qui" },
  { field: "freqFri", headerName: "Sex" },
  { field: "freqSat", headerName: "Sáb" },
  { field: "freqSun", headerName: "Dom" },
] as const;

interface DailyTripDetailsProps {
  open: boolean;
  onClose: () => void;
}

export function UpdateLineDialog({ open, onClose }: DailyTripDetailsProps) {
  const {
    methods,
    handleSubmit,
    isLoadingLine,
    countSections,
    lineSections,
    lineId,
    loadingCreate,
  } = useUpdateLineDialog();

  const handleClose = () => {
    onClose();
    methods.reset({});
  };

  const renderedSections = useMemo(() => {
    return lineSections?.map((section: LineSection, index: number) => {
      return <UpdateLineSectionForm key={section.id} seq={index} />;
    });
  }, [lineSections]);

  const DialogHeader = () => {
    if (lineId) return "Editar Rota";
    return "Adicionar Rota";
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <Dialog
        onClose={handleClose}
        open={open}
        fullWidth
        PaperProps={{ sx: { height: "auto", maxWidth: "1300px" } }}
      >
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(handleSubmit)}
            style={{ display: "flex", flexDirection: "column", height: "100%" }}
          >
            <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
              <Box display="flex" justifyContent="space-between">
                <DialogHeader />
              </Box>
            </DialogTitle>
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
            <DialogContent dividers sx={{ padding: "16px" }}>
              {isLoadingLine ? (
                <Box
                  sx={{
                    display: "flex",
                    flexGrow: 1,
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "32px",
                  }}
                >
                  <CircularProgress />
                </Box>
              ) : (
                <Box display="flex" flexDirection="column" gap="12px" mt="5px">
                  <Box display="flex" gap="20px">
                    <Grid container spacing={1}>
                      <Grid item xs={2}>
                        <Controller
                          name="line.code"
                          control={methods.control}
                          render={({ field, fieldState: { error } }) => {
                            return (
                              <TextField
                                {...field}
                                value={field?.value?.toUpperCase() || ""}
                                variant="outlined"
                                fullWidth
                                label="Código"
                                error={!!error?.message}
                                helperText={error?.message?.toString()}
                              />
                            );
                          }}
                        />
                      </Grid>
                      <Grid item xs={8}>
                        <Controller
                          name="line.description"
                          control={methods.control}
                          render={({ field, fieldState: { error } }) => (
                            <TextField
                              {...field}
                              value={field.value?.toUpperCase() || ""}
                              variant="outlined"
                              fullWidth
                              label="Descrição"
                              error={!!error?.message}
                              helperText={error?.message?.toString()}
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                  <Box display="flex" gap="20px">
                    <Grid container spacing={1} width={"100%"}>
                      <Grid item xs={2}>
                        <Controller
                          name="line.startDate"
                          control={methods.control}
                          render={({ field }) => (
                            <DatePicker
                              disabled={false}
                              sx={{ width: "100%" }}
                              label="Início"
                              {...field}
                              value={field.value ? dayjs(field.value) : null}
                              onChange={(date) =>
                                field.onChange(date?.format())
                              }
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={2}>
                        <Controller
                          name="line.endDate"
                          control={methods.control}
                          render={({ field }) => (
                            <DatePicker
                              disabled={false}
                              label="Fim"
                              sx={{ width: "100%" }}
                              {...field}
                              value={field.value ? dayjs(field.value) : null}
                              onChange={(date) =>
                                field.onChange(date?.format())
                              }
                              slotProps={{
                                textField: {
                                  error: false,
                                },
                              }}
                            />
                          )}
                        />
                      </Grid>
                      {daysOfWeek.map((day) => (
                        <Grid
                          display="flex"
                          justifyContent="center"
                          xs={0.295}
                          item
                          key={day.field}
                        >
                          <Controller
                            name={`line.${day.field}`}
                            control={methods.control}
                            render={({ field }) => (
                              <FormControlLabel
                                componentsProps={{
                                  typography: {
                                    variant: "body2",
                                  },
                                }}
                                sx={{
                                  display: "flex",
                                  flexDirection: "column-reverse",
                                  margin: "0",
                                }}
                                control={
                                  <Checkbox
                                    size="small"
                                    sx={{
                                      padding: "0",
                                    }}
                                    {...field}
                                    checked={Boolean(field.value)}
                                  />
                                }
                                label={day.headerName}
                              />
                            )}
                          />
                        </Grid>
                      ))}
                      <Grid item xs={1}>
                        <Controller
                          name="line.overtimeAllowed"
                          control={methods.control}
                          render={({ field, fieldState: { error } }) => (
                            <TextField
                              {...field}
                              variant="outlined"
                              fullWidth
                              label="Aprov Hr Extra"
                              error={!!error?.message}
                              helperText={error?.message?.toString()}
                              onChange={(e) => {
                                field.onChange(Number(e.target.value));
                              }}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={1}>
                        <Controller
                          name="line.cost"
                          control={methods.control}
                          render={({ field, fieldState: { error } }) => (
                            <TextField
                              {...field}
                              variant="outlined"
                              fullWidth
                              label="Custo"
                              error={!!error?.message}
                              helperText={error?.message?.toString()}
                              onChange={(e) => {
                                field.onChange(Number(e.target.value));
                              }}
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                  </Box>

                  <Box display="flex" gap="20px">
                    <Grid container spacing={1}>
                      <Grid item xs={2}>
                        <AutocompleteLocation
                          label="Origem"
                          name="line.locationOrig.code"
                          onChange={(value) =>
                            methods.setValue(
                              "line.locationOrigId",
                              value?.id || "",
                            )
                          }
                        />
                      </Grid>
                      <Grid item xs={2}>
                        <AutocompleteLocation
                          label="Destino"
                          name="line.locationDest.code"
                          onChange={(value) =>
                            methods.setValue(
                              "line.locationDestId",
                              value?.id || "",
                            )
                          }
                        />
                      </Grid>
                      <Grid item xs={2}>
                        <AutocompleteFleetGroup
                          name="line.fleetGroup"
                          onChange={(value) =>
                            methods.setValue(
                              "line.fleetGroupId",
                              value?.id || "",
                            )
                          }
                        />
                      </Grid>
                      <Grid item xs={2}>
                        <AutocompleteTripType
                          name="line.tripType.code"
                          onChange={(value) => {
                            methods.setValue(
                              "line.tripTypeId",
                              value?.id || "",
                            );
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                  <Box
                    gap="10px"
                    display="flex"
                    flexDirection="column"
                    maxHeight={"300px"}
                  >
                    <Box display="flex" alignItems="center" gap="8px">
                      <Typography variant="subtitle2">
                        Seções da viagem
                      </Typography>
                      {countSections && countSections > 0 && (
                        <Chip
                          label={countSections}
                          color="default"
                          size="small"
                        />
                      )}
                    </Box>
                    {lineSections?.length === 0 && (
                      <Box display="flex">
                        <Typography variant="body2" color={colors.grey[700]}>
                          Não há seções para essa viagem.
                        </Typography>
                      </Box>
                    )}

                    <Box gap="16px" display="flex" flexDirection="column">
                      {renderedSections}
                    </Box>
                  </Box>
                </Box>
              )}
            </DialogContent>

            {!isLoadingLine && (
              <UpdateLineFormFooter loadingCreate={loadingCreate} />
            )}
          </form>
        </FormProvider>
      </Dialog>
    </LocalizationProvider>
  );
}
