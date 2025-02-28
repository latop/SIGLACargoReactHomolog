import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { EmptyTruck } from "@/components/EmptyTruck";
import { colors, styled } from "@mui/material";

const StyledBox = styled(Box)`
  svg {
    width: 150px;
    height: 150px;
    fill: ${colors.grey[800]};
  }
`;

export function EmptyResult() {
  return (
    <StyledBox textAlign="center" margin="auto" p={2}>
      <EmptyTruck />
      <Typography variant="h6">Nenhum resultado encontrado</Typography>
    </StyledBox>
  );
}
