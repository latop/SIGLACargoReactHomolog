import { AutocompleteJustification } from "@/components/AutocompleteJustification";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import {
  Controller,
  FieldValues,
  FormProvider,
  useForm,
} from "react-hook-form";

interface Params {
  isOpen: boolean;
  handleClose: () => void;
  handleConfirm: (values: FieldValues) => void;
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

const ModalBatchCancelTrip = ({
  isOpen = false,
  handleClose,
  handleConfirm,
}: Params) => {
  const methods = useForm({
    defaultValues: {
      justificationId: undefined,
      justificationMessage: undefined,
      actionType: "1",
    },
  });

  const handleModalClose = () => {
    methods.reset();
    handleClose();
  };

  const handleSubmitAndClose = (data: FieldValues) => {
    handleConfirm(data);
    methods.reset();
    handleClose();
  };

  return (
    <Modal open={isOpen} onClose={handleModalClose}>
      <Box sx={style}>
        <Typography
          id="modal-modal-title"
          variant="h6"
          component="h2"
          style={{
            marginBottom: 20,
          }}
        >
          Cancelamento de Viagens
        </Typography>
        <Typography
          id="modal-modal-title"
          variant="subtitle2"
          component="h4"
          style={{
            marginBottom: 20,
          }}
        >
          Para dar andamento ao cancelamento, informe a justificativa
        </Typography>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleSubmitAndClose)}>
            <AutocompleteJustification
              name="justificativa"
              rules={{ required: "Campo obrigatório" }}
            />
            <Controller
              name={"justificationMessage"}
              control={methods.control}
              rules={{ required: "Campo obrigatório" }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  disabled={false}
                  label="Observações"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={5}
                  maxRows={10}
                  error={!!error}
                  sx={{
                    marginTop: 2,
                  }}
                  {...field}
                />
              )}
            />

            <Box
              display="flex"
              justifyContent={"space-between"}
              gap="10px"
              mt={2}
            >
              <Button type="submit" variant="contained" sx={{ width: "100%" }}>
                Confirmar
              </Button>
              <Button
                variant="outlined"
                onClick={handleClose}
                sx={{ width: "100%" }}
              >
                Fechar
              </Button>
            </Box>
          </form>
        </FormProvider>
      </Box>
    </Modal>
  );
};

export default ModalBatchCancelTrip;
