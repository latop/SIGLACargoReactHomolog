import React from "react";
import { Button } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

interface CollapseButtonProps {
  isOpen: boolean;
  onClick: () => void;
  buttonText?: string;
}

export function CollapseButton({
  isOpen,
  onClick,
  buttonText = "Mais Filtros",
}: CollapseButtonProps) {
  return (
    <Button
      type="button"
      size="large"
      variant="text"
      color="primary"
      onClick={onClick}
      endIcon={isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
    >
      {buttonText}
    </Button>
  );
}
