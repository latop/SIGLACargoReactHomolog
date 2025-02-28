import React from "react";
import DialogActions from "@mui/material/DialogActions";
import { Box, CircularProgress, Button, Typography, Icon } from "@mui/material";
import { useFormContext } from "react-hook-form";
import AddIcon from "@mui/icons-material/Add";
import theme from "@/styles/theme";
import { useAddLineFormFooter } from "./useAddLineFormFooter";

export function AddLineFormFooter() {
  const {
    formState: { isSubmitting },
  } = useFormContext();
  const { handleAddStep } = useAddLineFormFooter();

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
          <Button type="submit" variant="contained">
            {isSubmitting && (
              <CircularProgress
                color="inherit"
                size={20}
                sx={{ margin: "2px 11.45px" }}
              />
            )}
            {!isSubmitting && `Salvar`}
          </Button>
        </Box>
      </Box>
    </DialogActions>
  );
}
