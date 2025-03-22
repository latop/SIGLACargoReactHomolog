import { DatePicker, DateTimePicker } from "@/components/DatePicker";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import {
  Controller,
  FieldValues,
  FormProvider,
  useForm,
} from "react-hook-form";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AutocompleteJustification } from "@/components/AutocompleteJustification";

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

const ModalBatchAlterDatesTrip = ({
  isOpen = false,
  handleClose,
  handleConfirm,
}: Params) => {
  const methods = useForm({
    defaultValues: {
      justificationId: undefined,
      justificationMessage: undefined,
      deliveryDate: undefined,
      deliveryTime: undefined,
      requestDate: undefined,
      keepDriver: false,
      actionType: "4",
    },
  });

  const handleModalClose = () => {
    methods.reset(); // Reseta os valores do form
    handleClose(); // Fecha o modal
  };

  const handleSubmitAndClose = (data: FieldValues) => {
    const newData = {
      ...data,
      deliveryDate: `${dayjs(data.deliveryDate).format(
        "YYYY-MM-DD",
      )}T00:00:00.000Z`,
      deliveryTime: `1970-01-01T${dayjs(data.deliveryDate).format(
        "HH:mm:ss.sss",
      )}Z`,
      requestDate: dayjs(data.requestDate).format("YYYY-MM-DD"),
    };

    handleConfirm(newData); // Passa os dados para o handler de confirmação
    methods.reset(); // Limpa os dados do formulário após o submit
    handleClose();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
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
            Alterar Data e Horário
          </Typography>
          <Typography
            id="modal-modal-title"
            variant="subtitle2"
            component="h4"
            style={{
              marginBottom: 20,
            }}
          >
            Indique as informações novas de entrega ou solicitação e justifique
          </Typography>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(handleSubmitAndClose)}>
              <Box display="flex" flexDirection={"column"} gap="10px">
                <Box display="flex" flexDirection={"row"} gap="10px">
                  <Controller
                    name="deliveryDate"
                    control={methods.control}
                    render={({ field, fieldState: { error } }) => (
                      <DateTimePicker
                        format="DD/MM/YYYY HH:mm"
                        label="Nova Data/Hora de Entrega"
                        error={error?.message}
                        {...field}
                        value={field.value ? dayjs(field.value) : null}
                      />
                    )}
                  />
                  <Controller
                    name="requestDate"
                    control={methods.control}
                    render={({ field, fieldState: { error } }) => (
                      <DatePicker
                        format="DD/MM/YYYY"
                        label="Nova Data de Solicitação"
                        error={error?.message}
                        {...field}
                        value={field.value ? dayjs(field.value) : null}
                      />
                    )}
                  />
                </Box>
                <Controller
                  name={"keepDriver"}
                  control={methods.control}
                  render={({ field }) => (
                    <FormControlLabel
                      componentsProps={{
                        typography: {
                          variant: "body2",
                        },
                      }}
                      control={
                        <Checkbox
                          size="small"
                          {...field}
                          checked={field.value}
                        />
                      }
                      label={"Manter motorista associado"}
                    />
                  )}
                />
                <AutocompleteJustification name="justificationId" />
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
                      {...field}
                    />
                  )}
                />
              </Box>
              <Box
                display="flex"
                justifyContent={"space-between"}
                gap="10px"
                mt={2}
              >
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ width: "100%" }}
                >
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
    </LocalizationProvider>
  );
};

export default ModalBatchAlterDatesTrip;
