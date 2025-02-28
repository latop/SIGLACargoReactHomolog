import React from "react";
import { Typography } from "@mui/material";
import { colors } from "@mui/material";

export function HeaderTitle({ children }: { children: React.ReactNode }) {
  return (
    <Typography color={colors.grey[50]} variant="h6">
      {children}
    </Typography>
  );
}
