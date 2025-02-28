import * as React from "react";
import { Box } from "@mui/material";
import { useActivityDialog } from "../../useActivityDialog";

export function ActivityHeader() {
  const { activityDetailId } = useActivityDialog();

  return (
    <Box display="flex" justifyContent="space-between">
      {activityDetailId ? "Editar atividade" : "Adicionar atividade"}
    </Box>
  );
}
