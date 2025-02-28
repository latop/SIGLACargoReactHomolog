import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ReportIcon from "@mui/icons-material/Report";

export function ErrorResult() {
  return (
    <Box textAlign="center" margin="auto" p={2}>
      <ReportIcon color="error" fontSize="large" />
      <Typography variant="h6">Erro ao carregar os dados.</Typography>
    </Box>
  );
}
