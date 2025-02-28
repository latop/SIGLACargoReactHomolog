import React from "react";
import DialogActions from "@mui/material/DialogActions";
import { Box, CircularProgress, Button } from "@mui/material";
import { useFormContext } from "react-hook-form";

export function VehiclePlanningFormFooter() {
  const {
    formState: { isSubmitting },
  } = useFormContext();

  return (
    <DialogActions>
      <Box
        display="flex"
        justifyContent="flex-end"
        padding="10px"
        width="100%"
        gap={1}
      >
        <Button type="submit" variant="contained">
          {isSubmitting && (
            <CircularProgress
              color="inherit"
              size={20}
              sx={{ margin: "2px 11.45px" }}
            />
          )}
          {!isSubmitting && `Adicionar`}
        </Button>
      </Box>
    </DialogActions>
  );
}
