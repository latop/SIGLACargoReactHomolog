import React from "react";
import { Box } from "@mui/material";
import "dayjs/locale/pt-br";

export function GianttTable({ children }: { children: React.ReactNode }) {
  return <Box sx={{ height: "100%", width: "100%" }}>{children}</Box>;
}
