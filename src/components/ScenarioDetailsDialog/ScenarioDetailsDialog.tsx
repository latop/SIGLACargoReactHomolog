import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useToast } from "@/hooks/useToast";
import { ScenarioForm } from "./components/ScenarioForm";
import { Box, CircularProgress } from "@mui/material";
import { FieldValues, FormProvider } from "react-hook-form";
import { useScenarioDetailsDialog } from "./useScenarioDetailsDialog";
import { Scenario } from "@/interfaces/planning";
import { ScenarioFormFooter } from "./components/ScenarioFormFooter";
import { useFetch } from "@/hooks/useFetch";
import { useScenarios } from "@/hooks/useScenarios";
import { ErrorResult } from "../ErrorResult";

interface ScenarioDetailsProps {
  open: boolean;
  onClose: () => void;
}

export function ScenarioDetailsDialog({ open, onClose }: ScenarioDetailsProps) {
  const [createScenario] = useFetch();
  const { isLoading, methods, isEdit, error } = useScenarioDetailsDialog();
  const { mutate: refetchScenarios } = useScenarios();
  const { addToast } = useToast();

  const onSubmit = async (data: FieldValues) => {
    // const { scenarioCapacities, ...body } = data;
    await createScenario("/Scenario", data as Scenario, {
      onSuccess: () => {
        addToast("Cenário salvo com sucesso");
        refetchScenarios();
        onClose();
      },
      onError: () => {
        addToast("Erro ao salvar cenário", { type: "error" });
      },
    });
  };

  const handleClose = () => {
    onClose();
    methods.reset();
  };

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      fullWidth
      PaperProps={{ sx: { height: "100%", maxWidth: "1400px" } }}
    >
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          style={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          <>
            <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
              <Box display="flex" justifyContent="space-between">
                {isEdit ? "Editar cenário" : "Adicionar cenário"}
              </Box>
            </DialogTitle>
            <IconButton
              aria-label="close"
              onClick={onClose}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
            <DialogContent
              dividers
              sx={{
                padding: "16px",
              }}
            >
              {isLoading && <CircularProgress />}
              {!isLoading && !error && <ScenarioForm />}
              {error && <ErrorResult />}
            </DialogContent>
            <ScenarioFormFooter />
          </>
        </form>
      </FormProvider>
    </Dialog>
  );
}
