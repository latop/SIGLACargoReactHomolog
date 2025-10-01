import Modal from "@/components/Modal";
import { Box, Button, TextField, Typography } from "@mui/material";

interface Params {
  isOpen?: boolean;
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

const ModalJustification = ({ isOpen = false, handleClose }: Params) => {
  // const { control, setValue, getValues } = useFormContext();

  const handleSave = () => {
    console.log("Salvou");
  };

  return (
    <Modal isOpen={isOpen} handleClose={handleClose} handleSave={handleSave}>
      <Box sx={style}>
        <Typography
          id="modal-modal-title"
          variant="h6"
          component="h2"
          style={{
            marginBottom: 20,
          }}
        >
          Justificativa
        </Typography>
        <TextField
          disabled={false}
          label="Observações"
          variant="outlined"
          fullWidth
          multiline
          maxRows={10}
        />

        <Box display="flex" justifyContent={"flex-end"} gap="10px" mt={2}>
          <Button variant="outlined" onClick={handleClose}>
            Fechar
          </Button>
          <Button variant="contained">Salvar</Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ModalJustification;
