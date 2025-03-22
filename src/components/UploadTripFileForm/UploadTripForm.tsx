"use client";
import { Button, CircularProgress, Grid, Input } from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import { CSSProperties } from "react";
import { FormProvider } from "react-hook-form";
import { AutocompleteLocationGroup } from "@/components/AutocompleteLocationGroup";
import { useImportTrips } from "@/hooks/useImportTrips";
import { ClearIcon } from "@mui/x-date-pickers";
import { GridAddIcon } from "@mui/x-data-grid";
import React from "react";

const labelStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  cursor: "pointer",
};

export function UploadTripFileForm() {
  const {
    formMethods,
    onSubmit,
    handleFileChange,
    selectedFile,
    currentFile,
    handleClearFile,
    loadingPostFile,
    isLoading,
  } = useImportTrips();

  const ButtonFileActions = () => {
    if (isLoading) return null;

    if (currentFile)
      return (
        <Button
          onClick={handleClearFile}
          variant="outlined"
          size="large"
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          {loadingPostFile ? (
            <CircularProgress size="20px" />
          ) : (
            <>
              <p
                style={{
                  maxWidth: "100px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {currentFile}
              </p>
              <ClearIcon fontSize="small" />
            </>
          )}
        </Button>
      );

    return (
      <Button color="primary" variant="outlined" size="large">
        <label style={labelStyle}>
          <Input
            type="file"
            sx={{ display: "none" }}
            inputProps={{ accept: ".xlsx" }}
            {...formMethods.register("File", {
              onChange: handleFileChange,
            })}
          />
          Importar Viagem
          <GridAddIcon fontSize="small" />
        </label>
      </Button>
    );
  };

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={formMethods.handleSubmit(onSubmit)}
        style={{
          flexGrow: 1,
        }}
      >
        <Grid
          display={"flex"}
          gap={1}
          alignItems={"flex-start"}
          flexDirection={"row"}
          justifyContent={"flex-end"}
        >
          <Grid item>
            <ButtonFileActions />
          </Grid>
          <Grid item xs={1.25}>
            {selectedFile && (
              <AutocompleteLocationGroup
                name="Locationcode"
                label="Cód. Loc"
                onChange={(value) =>
                  formMethods.setValue("Locationcode", value?.code || "")
                }
              />
            )}
          </Grid>

          <Grid item>
            {selectedFile && (
              <Button
                type="submit"
                color="primary"
                variant="contained"
                size="large"
              >
                <UploadIcon />
              </Button>
            )}
          </Grid>
        </Grid>
      </form>
    </FormProvider>
  );
}
