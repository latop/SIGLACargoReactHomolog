"use client";

import { Button, Grid } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Controller, FieldValues, FormProvider } from "react-hook-form";
import SettingsIcon from "@mui/icons-material/Settings";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useTripOptmizationFilterBar } from "@/hooks/useTripOptimizationFilterBar";
import { AutocompleteLocationGroup } from "../AutocompleteLocationGroup";
import { useTripOptimization } from "@/hooks/useTripOptimization";
import { useToast } from "@/hooks/useToast";
import { useDialog } from "@/hooks/useDialog/useDialog";
import dayjs from "dayjs";

export function TripOptmizationFilterBar() {
  const { methods, onSubmit } = useTripOptmizationFilterBar();

  const { control, handleSubmit } = methods;
  const { mutate, isLoading, handleOptmizeTrip } = useTripOptimization();
  const { addToast } = useToast();

  const { openDialog, closeDialog } = useDialog();
  const handleDialogOptmize = (data: FieldValues) => {
    const params = {
      start: dayjs(data.start).format("YYYY-MM-DD"),
      end: dayjs(data.end).format("YYYY-MM-DD"),
      locationGroupCode: data.locationGroupCode,
    };

    openDialog({
      title: "Confirmar otimização",
      message: "Deseja realmente otimizar essa viagem?",
      onConfirm: async () => {
        await handleOptmizeTrip(params, {
          onSuccess: () => {
            addToast("Otimizando viagem", { type: "success" });
            closeDialog();
            mutate();
          },
          onError: () => {
            addToast(
              "Possivelmente sem demandas para otimização, tente novamente mais tarde.",
              { type: "error" },
            );
            closeDialog();
          },
        });
      },
      onCancel: () => {
        closeDialog();
      },
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <FormProvider {...methods}>
        <form style={{ width: "100%" }} onSubmit={handleSubmit(onSubmit)}>
          <Grid container alignItems="flex-start" spacing={1}>
            <Grid item xs={1.5}>
              <Controller
                name="start"
                rules={{ required: true }}
                control={control}
                render={({ field }) => <DatePicker label="Início" {...field} />}
              />
            </Grid>
            <Grid item xs={1.5}>
              <Controller
                name="end"
                rules={{ required: true }}
                control={control}
                render={({ field }) => <DatePicker label="Fim" {...field} />}
              />
            </Grid>
            <Grid item xs={2}>
              <AutocompleteLocationGroup
                name="locationGroupCode"
                label="Cód. Loc"
                onChange={(value) => {
                  methods.setValue("locationGroupCode", value?.code as string);
                }}
              />
            </Grid>
            <Grid item xs={4} display="flex" gap="4px">
              <Button
                size="large"
                variant="contained"
                color="primary"
                onClick={methods.handleSubmit(handleDialogOptmize)}
              >
                Otimizar
                <SettingsIcon fontSize="inherit" sx={{ ml: "5px" }} />
              </Button>
              <Button
                onClick={() => mutate()}
                size="large"
                variant="contained"
                color="primary"
              >
                {isLoading ? (
                  "Carregando..."
                ) : (
                  <>
                    Atualizar
                    <RefreshIcon fontSize="inherit" sx={{ ml: "5px" }} />
                  </>
                )}
              </Button>
            </Grid>
          </Grid>
        </form>
      </FormProvider>
    </LocalizationProvider>
  );
}
