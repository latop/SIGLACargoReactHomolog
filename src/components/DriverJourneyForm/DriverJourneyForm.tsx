import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import {
  TextField,
  Grid,
  Box,
  IconButton,
  colors,
  Typography,
  CircularProgress,
  Icon,
  InputAdornment,
} from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@/components/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import SearchIcon from "@mui/icons-material/Search";
import customParseFormat from "dayjs/plugin/customParseFormat";
import DeleteIcon from "@mui/icons-material/Delete";
import { AutocompleteActivity } from "../AutocompleteActivity";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import "dayjs/locale/pt-br";
import { useDailyTripJourneyDetails } from "@/hooks/useDailyTripJourneyDetails";
import { DailyTrip, TaskDriver } from "@/interfaces/schedule";
import { useToast } from "@/hooks/useToast";
import { SectionsReturnForm } from "@/components/SectionsReturnForm";
import SectinReturnTimeline from "../SectionReturnTimeline/SectionReturnTimeline";
import { AutocompleteLocation } from "@/components/AutocompleteLocation";

dayjs.extend(customParseFormat);

interface DriverJourneyFormProps {
  onDelete: () => void;
  seq: number;
}

export const DriverJourneyForm = ({
  onDelete,
  seq,
}: DriverJourneyFormProps) => {
  const [showDemandDetails, setShowDemandDetails] = React.useState(false);
  const { addToast } = useToast();
  const { control, getValues, setValue, watch } = useFormContext();

  const handleSuccessDemand = (data: DailyTrip) => {
    if (data.sto) {
      setValue(`tasksDriver.${seq}.demand`, data.sto);
      setValue(`tasksDriver.${seq}.lineCode`, data.lineCode);
      setValue(`tasksDriver.${seq}.locOrig`, data.locationOrigCode);
      setValue(`tasksDriver.${seq}.locDest`, data.locationDestCode);
      setValue(`tasksDriver.${seq}.startPlanned`, data.startPlanned);
      setValue(`tasksDriver.${seq}.endPlanned`, data.endPlanned);

      addToast("Demanda encontrada com sucesso!", {
        type: "success",
      });
    } else {
      addToast("Demanda não encontrada.", {
        type: "error",
      });
    }
  };

  const handleSuccessReturn = (data: DailyTrip) => {
    if (data.lineCode) {
      const tasksDriver = getValues("tasksDriver");
      tasksDriver.push({
        seq: tasksDriver.length + 1,
        type: "V",
        demand: data.lineCode,
        locOrig: data.locationOrigCode,
        locDest: data.locationDestCode,
        lineCode: data.lineCode,
        startPlanned: data.startPlanned,
        endPlanned: data.endPlanned,
        startActual: null,
        endActual: null,
      });

      setValue("tasksDriver", tasksDriver);

      addToast("Retorno adicionado com sucesso!", {
        type: "success",
      });
    } else {
      addToast(
        "Não foi possível adicionar o retorno. Por favor, insira manualmente.",
        {
          type: "error",
        },
      );
    }
  };

  const handleSuccessDemandSections = (data: DailyTrip) => {
    setValue(`tasksDriver.${seq}.sectionsReturn`, data.sectionsReturn);
    setShowDemandDetails(true);
  };

  const [fetchDailyTrip, { isLoading: isLaodingDemand }] =
    useDailyTripJourneyDetails({
      onSuccess: handleSuccessDemand,
    });

  const [fetchReturn, { isLoading: isLoadingReturn }] =
    useDailyTripJourneyDetails({
      onSuccess: handleSuccessReturn,
    });

  const [fetchDemandSections, { isLoading: isLoadingDemandSections }] =
    useDailyTripJourneyDetails({
      onSuccess: handleSuccessDemandSections,
    });

  const isTravel = getValues(`tasksDriver.${seq}.type`) === "V";
  const isActivity = getValues(`tasksDriver.${seq}.type`) === "A";

  const handleSearchClick = (demand: string) => {
    if (demand) {
      fetchDailyTrip({
        demand,
      });
    }
  };

  const handleAddReturnTravel = () => {
    fetchReturn({
      lineCode: getValues(`tasksDriver.${seq}.lineCode`),
      isReturn: true,
      idTask: getValues(`tasksDriver.${seq}.idTask`),
    });
  };

  const handleShowDemandDetails = () => {
    if (!showDemandDetails) {
      fetchDemandSections({
        demand: getValues(`tasksDriver.${seq}.demand`),
      });
    } else {
      setShowDemandDetails(false);
    }
  };

  const renderTravelFields = () => (
    <Grid container spacing={1}>
      <Grid item xs={1.5}>
        <Controller
          name={`tasksDriver.${seq}.demand`}
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Demanda"
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title="Buscar demanda" arrow>
                      <>
                        {isLaodingDemand && (
                          <CircularProgress color="inherit" size={16} />
                        )}
                        {!isLaodingDemand && (
                          <SearchIcon
                            fontSize="small"
                            onClick={() => handleSearchClick(field.value)}
                            style={{ cursor: "pointer" }}
                          />
                        )}
                      </>
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
      </Grid>
      <Grid item xs={1.5}>
        <Controller
          name={`tasksDriver.${seq}.lineCode`}
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Cód. Rota"
              InputLabelProps={{ shrink: !!field.value }}
              fullWidth
            />
          )}
        />
      </Grid>
      <Grid item xs={1.2}>
        <AutocompleteLocation
          name={`tasksDriver.${seq}.locOrig`}
          label="Origem"
        />
      </Grid>
      <Grid item xs={1.2}>
        <AutocompleteLocation
          name={`tasksDriver.${seq}.locDest`}
          label="Destino"
        />
      </Grid>
      <Grid item xs={1.7}>
        <Controller
          name={`tasksDriver.${seq}.startPlanned`}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <DateTimePicker
              label="Início planejado"
              error={error?.message}
              {...field}
              value={field.value ? dayjs(field.value) : null}
              onChange={(date) => field.onChange(date?.format())}
            />
          )}
        />
      </Grid>
      <Grid item xs={1.7}>
        <Controller
          name={`tasksDriver.${seq}.endPlanned`}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <DateTimePicker
              label="Fim planejado"
              error={error?.message}
              {...field}
              slotProps={{}}
              value={field.value ? dayjs(field.value) : null}
              onChange={(date) => field.onChange(date?.format())}
            />
          )}
        />
      </Grid>
      <Grid item xs={1.6}>
        <Controller
          name={`tasksDriver.${seq}.startActual`}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <DateTimePicker
              label="Início realizado"
              error={error?.message}
              {...field}
              value={field.value ? dayjs(field.value) : null}
              onChange={(date) => field.onChange(date?.format())}
            />
          )}
        />
      </Grid>
      <Grid item xs={1.6}>
        <Controller
          name={`tasksDriver.${seq}.endActual`}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <DateTimePicker
              label="Fim realizado"
              error={error?.message}
              {...field}
              value={field.value ? dayjs(field.value) : null}
              onChange={(date) => field.onChange(date?.format())}
            />
          )}
        />
      </Grid>
    </Grid>
  );

  const renderActivityFields = () => (
    <Grid container spacing={1}>
      <Grid item xs={1.7}>
        <AutocompleteActivity
          name={`tasksDriver.${seq}.activityCode`}
          onChange={(activity) => {
            setValue(`tasksDriver.${seq}.activityCode`, activity.code);
            setValue(`tasksDriver.${seq}.activityId`, activity.id);
          }}
        />
      </Grid>
      <Grid item xs={1.7}>
        <Controller
          name={`tasksDriver.${seq}.startPlanned`}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <DateTimePicker
              label="Início planejado"
              error={error?.message}
              {...field}
              value={field.value ? dayjs(field.value) : null}
              onChange={(date) => field.onChange(date?.format())}
            />
          )}
        />
      </Grid>
      <Grid item xs={1.6}>
        <Controller
          name={`tasksDriver.${seq}.endPlanned`}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <DateTimePicker
              label="Fim planejado"
              error={error?.message}
              {...field}
              value={field.value ? dayjs(field.value) : null}
              onChange={(date) => field.onChange(date?.format())}
            />
          )}
        />
      </Grid>
      <Grid item xs={1.6}>
        <Controller
          name={`tasksDriver.${seq}.startActual`}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <DateTimePicker
              label="Início realizado"
              error={error?.message}
              {...field}
              value={field.value ? dayjs(field.value) : null}
              onChange={(date) => field.onChange(date?.format())}
            />
          )}
        />
      </Grid>
      <Grid item xs={1.6}>
        <Controller
          name={`tasksDriver.${seq}.endActual`}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <DateTimePicker
              label="Fim realizado"
              error={error?.message}
              {...field}
              value={field.value ? dayjs(field.value) : null}
              onChange={(date) => field.onChange(date?.format())}
            />
          )}
        />
      </Grid>
    </Grid>
  );

  const sectionsReturn = watch(`tasksDriver.${seq}.sectionsReturn`);
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <Box
        display={"flex"}
        flexDirection="column"
        gap="16px"
        padding="10px"
        bgcolor={colors.grey[100]}
        borderRadius="4px"
      >
        <Box display="flex" gap="10px" alignItems="center">
          {isTravel && renderTravelFields()}
          {isActivity && renderActivityFields()}
          <Box display="flex" gap="0" alignItems="center">
            {isTravel && (
              <Tooltip title="Adicionar retorno" arrow>
                <IconButton size="small" onClick={handleAddReturnTravel}>
                  {isLoadingReturn && (
                    <CircularProgress
                      color="inherit"
                      size={16}
                      sx={{ marginLeft: "4px" }}
                    />
                  )}
                  {!isLoadingReturn && (
                    <Icon component={KeyboardReturnIcon} fontSize="small" />
                  )}
                </IconButton>
              </Tooltip>
            )}
            {isTravel && (
              <Tooltip title="Mostrar detalhes" arrow>
                <IconButton size="small" onClick={handleShowDemandDetails}>
                  {isLoadingDemandSections && (
                    <CircularProgress
                      color="inherit"
                      size={16}
                      sx={{ marginLeft: "4px" }}
                    />
                  )}
                  {!isLoadingDemandSections && (
                    <Icon
                      component={KeyboardArrowDownIcon}
                      fontSize="small"
                      sx={{
                        transition: "0.1s all ease-in-out",
                        transform: showDemandDetails
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                      }}
                    />
                  )}
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="Remover viagem" arrow>
              <IconButton size="small" onClick={onDelete}>
                <Icon component={DeleteIcon} fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        {showDemandDetails && (
          <Box display="flex" alignItems="center" sx={{ position: "relative" }}>
            {sectionsReturn?.length && (
              <>
                <SectinReturnTimeline
                  size={sectionsReturn?.length}
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: "-30px",
                    zIndex: 2,
                    marginTop: "20px",
                  }}
                />
                <Box display="flex" flexDirection="column" gap="15px" mt="10px">
                  {sectionsReturn?.map((section: TaskDriver, index: number) => (
                    <SectionsReturnForm
                      seq={index}
                      taskDriverSeq={seq}
                      key={index}
                    />
                  ))}
                </Box>
              </>
            )}
            {!sectionsReturn?.length && (
              <Box display="flex" alignItems="center">
                <Typography variant="body2" color={colors.grey[700]}>
                  Não há seções de retorno para esta viagem.
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </LocalizationProvider>
  );
};
