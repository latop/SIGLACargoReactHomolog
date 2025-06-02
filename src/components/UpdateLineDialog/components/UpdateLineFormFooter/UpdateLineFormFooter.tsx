import React from "react";
import DialogActions from "@mui/material/DialogActions";
import { Box, CircularProgress, Button, Typography, Icon } from "@mui/material";
import { useFormContext } from "react-hook-form";
import AddIcon from "@mui/icons-material/Add";
import theme from "@/styles/theme";
import { useUpdateLineFormFooter } from "./useUpdateLineFormFooter";
import { useUpdateLineDialog } from "../../useUpdateLineDialog";
import { useDialog } from "@/hooks/useDialog/useDialog";

export function UpdateLineFormFooter({
  loadingCreate,
}: {
  loadingCreate: boolean;
}) {
  const { getValues } = useFormContext();
  const { handleAddStep } = useUpdateLineFormFooter();
  const { handleSubmit } = useUpdateLineDialog();

  const { openDialog } = useDialog();

  return (
    <DialogActions>
      <Box
        display="flex"
        justifyContent="space-between"
        padding="10px"
        width="100%"
      >
        <Box display="flex" gap="10px">
          <Button
            disabled={loadingCreate}
            variant="outlined"
            onClick={handleAddStep}
            color="primary"
            size="small"
          >
            <Icon component={AddIcon} fontSize="small" />
            <Typography
              variant="body2"
              ml="5px"
              color={theme.palette.primary.main}
            >
              Etapa
            </Typography>
          </Button>
        </Box>
        <Box display="flex" gap="10px">
          <Button
            disabled={loadingCreate}
            variant="contained"
            onClick={() => {
              openDialog({
                title: "Atualizar a rota",
                message: "Deseja realmente atualizar essa rota?",
                onConfirm: async () => {
                  await handleSubmit({
                    line: getValues("line"),
                    lineSections: getValues("lineSections"),
                  });
                },
              });
            }}
          >
            {loadingCreate && (
              <CircularProgress
                color="inherit"
                size={20}
                sx={{ margin: "2px 11.45px" }}
              />
            )}
            {!loadingCreate && `Salvar`}
          </Button>
        </Box>
      </Box>
    </DialogActions>
  );
}
