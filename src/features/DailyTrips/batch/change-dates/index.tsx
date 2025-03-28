import { DatePicker } from "@/components/DatePicker";
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
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TimePicker } from "@/components/TimePicker";

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

const dateOrDayjsSchema = z.custom(
  (val) => val instanceof Date || dayjs.isDayjs(val),
  {
    message: "Data é obrigatório",
  },
);
const schema = z.object({
  justificationId: z.string().optional(),
  justificationMessage: z.string(),
  deliveryDate: dateOrDayjsSchema,
  deliveryTime: dateOrDayjsSchema,
  requestDate: dateOrDayjsSchema,
  keepDriver: z.boolean().optional(),
  actionType: z.string().optional(),
});

const ModalBatchAlterDatesTrip = ({
  isOpen = false,
  handleClose,
  handleConfirm,
}: Params) => {
  const methods = useForm({
    resolver: zodResolver(schema),
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
    methods.reset();
    handleClose();
  };

  const handleSubmitAndClose = (data: FieldValues) => {
    const newData = {
      ...data,
      deliveryDate: `${dayjs(data.deliveryDate).format(
        "YYYY-MM-DD",
      )}T00:00:00.000Z`,
      deliveryTime: dayjs(data.deliveryTime).format("1970-01-01THH:mm:ss.sss"),
      requestDate: dayjs(data.requestDate).format("YYYY-MM-DD"),
    };
    console.log(newData);
    handleConfirm(newData);
    methods.reset();
    handleClose();
  };

  console.log(methods.getValues());

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
                      <DatePicker
                        format="DD/MM/YYYY"
                        label="Data"
                        error={error?.message}
                        {...field}
                        value={field.value ? dayjs(field.value) : null}
                      />
                    )}
                  />
                  <Controller
                    name="deliveryTime"
                    control={methods.control}
                    render={({ field, fieldState: { error } }) => (
                      <TimePicker
                        label="Hora"
                        error={error?.message}
                        ampm={false}
                        {...field}
                        value={field.value ? dayjs(field.value) : null}
                        onChange={(time) => {
                          field.onChange(dayjs(time?.format()));
                        }}
                      />
                    )}
                  />
                  <Controller
                    name="requestDate"
                    control={methods.control}
                    render={({ field, fieldState: { error } }) => (
                      <DatePicker
                        format="DD/MM/YYYY"
                        label="Data de Solicitação"
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
                <AutocompleteJustification
                  name="justificationId"
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
