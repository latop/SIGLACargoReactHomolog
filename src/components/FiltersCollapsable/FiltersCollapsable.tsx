import React from "react";
import { Collapse, Grid } from "@mui/material";

interface FiltersCollapseProps {
  children: React.ReactNode;
  isOpen: boolean;
}

export function FiltersCollapsable({ children, isOpen }: FiltersCollapseProps) {
  return (
    <Collapse in={isOpen} timeout={300}>
      <Grid container gap={0.5}>
        {children}
      </Grid>
    </Collapse>
  );
}
