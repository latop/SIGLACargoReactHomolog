import { Box, Button, Modal as MUIModal } from "@mui/material";
import React from "react";

interface Params {
  isOpen?: boolean;
  children?: React.ReactNode;
  handleSave?: () => void;
  handleClose?: () => void;
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const Modal = ({
  isOpen = false,
  children,
  handleClose,
  handleSave,
}: Params) => {
  return (
    <MUIModal
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        {children}

        <Box display="flex" justifyContent={"flex-end"} gap="10px" mt={2}>
          <Button variant="outlined" onClick={handleClose}>
            Fechar
          </Button>
          <Button variant="contained" onClick={handleSave}>
            Salvar
          </Button>
        </Box>
      </Box>
    </MUIModal>
  );
};

export default Modal;
