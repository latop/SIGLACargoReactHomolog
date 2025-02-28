import React from "react";
import DialogActions from "@mui/material/DialogActions";
import { Box, CircularProgress, Button } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { useDialog } from "@/hooks/useDialog/useDialog";
import { useToast } from "@/hooks/useToast";

export function ActivityFooter({ onClose }: { onClose: () => void }) {
  const {
    formState: { isSubmitting },
  } = useFormContext();

  const { openDialog } = useDialog();
  const { addToast } = useToast();

  const handleDelete = () => {
    openDialog({
      title: "Deletar atividade",
      message: "Deseja realmente deletar essa atividade?",
      onConfirm: () => {
        addToast("Atividade deletada com sucesso", { type: "success" });
        onClose();
      },
    });
  };

  return (
    <DialogActions>
      <Box display="flex" justifyContent="flex-end" padding="10px" width="100%">
        <Box display="flex" gap="10px">
          <Button variant="contained" color="error" onClick={handleDelete}>
            Deletar
          </Button>
          <Button type="submit" variant="contained">
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
      </Box>
    </DialogActions>
  );
}
