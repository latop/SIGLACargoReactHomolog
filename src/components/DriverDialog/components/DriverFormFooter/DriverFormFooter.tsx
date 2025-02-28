import React from "react";
import DialogActions from "@mui/material/DialogActions";
import { Box, CircularProgress, Button } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { useDialog } from "@/hooks/useDialog/useDialog";
import { useDriverDialog } from "../../useDriverDialog";
import { useDriverFormFooter } from "./useDriverFormFooter";

export function DriverFormFooter() {
  const {
    getValues,
    formState: { isSubmitting },
  } = useFormContext();
  const { handleSubmit, isToAddDriverToAdd } = useDriverDialog();
  const { openDialog } = useDialog();
  const { handleAddStep } = useDriverFormFooter();

  const dialogTexts = {
    title: isToAddDriverToAdd ? "Adicionar Motorista" : "Atualizar Motorista",
    message: isToAddDriverToAdd
      ? "Deseja realmente adicionar esse motorista?"
      : "Deseja realmente atualizar esse motorista?",
  };

  return (
    <DialogActions>
      <Box
        display="flex"
        justifyContent="space-between"
        padding="10px"
        width="100%"
      >
        <Button
          onClick={handleAddStep}
          variant="outlined"
          sx={{
            width: "150px",
            alignSelf: "flex-end",
          }}
        >
          Adicionar
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            openDialog({
              ...dialogTexts,
              onConfirm: async () => {
                await handleSubmit(getValues());
              },
            });
          }}
        >
          {isSubmitting && (
            <CircularProgress
              color="inherit"
              size={20}
              sx={{ margin: "2px 11.45px" }}
            />
          )}
          {!isSubmitting && `Salvar`}
        </Button>
      </Box>
    </DialogActions>
  );
}
