import React from "react";
import { Controller, FormProvider } from "react-hook-form";
import dayjs from "dayjs";
import { Button, Grid } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@/components/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { AutocompleteLocationGroup } from "@/components/AutocompleteLocationGroup";

import PublishIcon from "@mui/icons-material/Publish";
import "dayjs/locale/pt-br";
import { usePublishJourneyFilterBar } from "@/hooks/usePublishJourneyFilterBar";

dayjs.extend(customParseFormat);

export function PublishJourneyFilterBar(
  props: React.HTMLProps<HTMLFormElement>,
) {
  const { methods, onSubmit, isLoading } = usePublishJourneyFilterBar();
  const { control, handleSubmit } = methods;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} {...props}>
          <Grid
            display="flex"
            container
            alignItems="flex-start"
            gap="16px"
            padding="20px 0"
          >
            <Grid item xs={1.5}>
              <Controller
                name="dtPublish"
                rules={{ required: true }}
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    label="Data de início"
                    error={error?.message}
                    {...field}
                  />
                )}
              />
            </Grid>
            <Grid item xs={2}>
              <AutocompleteLocationGroup
                name="locationGroup.code"
                label="Base"
                onChange={(value) => {
                  methods.setValue("locationGroupId", value?.id || "");
                }}
              />
            </Grid>
            <Grid item xs={1}>
              <Button
                type="submit"
                size="large"
                variant="contained"
                color="primary"
                fullWidth
                disabled={isLoading}
              >
                {!isLoading && (
                  <>
                    Publicar <PublishIcon />
                  </>
                )}
                {isLoading && "Publicando..."}
              </Button>
            </Grid>
          </Grid>
        </form>
      </FormProvider>
    </LocalizationProvider>
  );
}
