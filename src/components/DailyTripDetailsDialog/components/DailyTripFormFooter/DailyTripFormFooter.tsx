import React, { useState } from "react";
import DialogActions from "@mui/material/DialogActions";
import AddIcon from "@mui/icons-material/Add";
import theme from "@/styles/theme";
import { Box, CircularProgress, Typography, Button, Icon } from "@mui/material";
import { useDailyTripFormFooter } from "./useDailyTripFormFooter";
import { useFormContext } from "react-hook-form";
import ModalJustification from "../Modals/ModalJustification";

export function DailyTripFormFooter() {
  const {
    formState: { isSubmitting },
  } = useFormContext();
  const { handleAddStep } = useDailyTripFormFooter();
  const [modalOpen, setModalOpen] = useState({
    justifyModal: false,
    scheduleModal: false,
    logsModal: false,
  });

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
          <Button disabled variant="outlined">
            {isSubmitting && (
              <CircularProgress
                color="inherit"
                size={20}
                sx={{ margin: "2px 11.45px" }}
              />
            )}
            Horários Planejados
          </Button>
          <Button
            variant="outlined"
            onClick={() => setModalOpen({ ...modalOpen, justifyModal: true })}
          >
            {isSubmitting && (
              <CircularProgress
                color="inherit"
                size={20}
                sx={{ margin: "2px 11.45px" }}
              />
            )}
            Justificativas
          </Button>
          <Button disabled variant="outlined">
            {isSubmitting && (
              <CircularProgress
                color="inherit"
                size={20}
                sx={{ margin: "2px 11.45px" }}
              />
            )}
            Auditoria
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
      {modalOpen.justifyModal && (
        <ModalJustification
          isOpen={modalOpen.justifyModal}
          handleClose={() =>
            setModalOpen({ ...modalOpen, justifyModal: false })
          }
        />
      )}
    </DialogActions>
  );
}
