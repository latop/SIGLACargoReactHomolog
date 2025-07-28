import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import {
  Box,
  TextField,
  Grid,
  colors,
  IconButton,
  Icon,
  Tooltip,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import DeleteIcon from "@mui/icons-material/Delete";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "dayjs/locale/pt-br";
import { AutocompleteLocation } from "@/components/AutocompleteLocation";
import { AutocompleteStopType } from "@/components/AutocompleteStopType";
import { AutocompleteLocationGroup } from "@/components/AutocompleteLocationGroup";

dayjs.extend(customParseFormat);

export const UpdateLineSectionForm = ({ seq }: { seq: number }) => {
  const { control, setValue, getValues } = useFormContext();

  const handleDeleteStep = () => {
    const steps = getValues("lineSections");
    steps.splice(seq, 1);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updatedSteps = steps.map((step: any, index: number) => ({
      ...step,
      section: index + 1,
    }));
    setValue("lineSections", updatedSteps);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <Box
        display={"flex"}
        padding="10px"
        bgcolor={colors.grey[100]}
        borderRadius="4px"
      >
        <Grid container spacing={1}>
          <Grid item xs={1}>
            <Controller
              name={`lineSections.${seq}.section`}
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  variant="outlined"
                  fullWidth
                  label="Etapa"
                  error={!!error?.message}
                  helperText={error?.message?.toString()}
                />
              )}
            />
          </Grid>
          <Grid item xs={1}>
            <Controller
              name={`lineSections.${seq}.duration`}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  inputProps={{ maxLength: 3, inputMode: "numeric" }}
                  variant="outlined"
                  fullWidth
                  label="Duração"
                  onChange={(event) => {
                    const inputValue = event.target.value;
                    if (/^\d*$/.test(inputValue)) {
                      setValue(`lineSections.${seq}.duration`, inputValue);
                    }
                  }}
                />
              )}
            />
          </Grid>
          <Grid item xs={3}>
            <AutocompleteLocation
              name={`lineSections.${seq}.locationOrig.code`}
              label="Origem"
              onChange={(value) => {
                setValue(`lineSections.${seq}.locationOrigId`, value?.id || "");
                setValue(`lineSections.${seq}.locationOrig`, value || "");
              }}
            />
          </Grid>
          <Grid item xs={3}>
            <AutocompleteLocation
              label="Destino"
              name={`lineSections.${seq}.locationDest.code`}
              onChange={(value) => {
                setValue(`lineSections.${seq}.locationDestId`, value?.id || "");
                setValue(`lineSections.${seq}.locationDest`, value || "");
              }}
            />
          </Grid>
          <Grid item xs={1.5}>
            <AutocompleteLocationGroup
              label="Base vinculada"
              name={`lineSections.${seq}.locationGroup.code`}
              onChange={(value) => {
                setValue(
                  `lineSections.${seq}.locationGroupId`,
                  value?.id || "",
                );
              }}
            />
          </Grid>
          <Grid item xs={1.5}>
            <AutocompleteStopType
              name={`lineSections.${seq}.stopType.stopTypeCode`}
              onChange={(value) => {
                setValue(`lineSections.${seq}.stopTypeId`, value?.id);
                setValue(`lineSections.${seq}.stopType`, value || "");
              }}
            />
          </Grid>
          <Grid item xs={1}>
            <Controller
              name={`lineSections.${seq}.logisticHub`}
              control={control}
              render={({ field }) => {
                return (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={field.value}
                        {...field}
                        sx={{ padding: "0" }}
                      />
                    }
                    label="Ponto de troca"
                    componentsProps={{
                      typography: {
                        sx: {
                          fontSize: "12px",
                          color: colors.grey[600],
                        },
                      },
                    }}
                    sx={{
                      display: "flex",
                      flexDirection: "column-reverse",
                      margin: "0",
                      alignItems: "center",
                    }}
                  />
                );
              }}
            />
          </Grid>
        </Grid>
        <Tooltip title="Remover viagem" arrow>
          <IconButton size="small" onClick={handleDeleteStep}>
            <Icon component={DeleteIcon} fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </LocalizationProvider>
  );
};
