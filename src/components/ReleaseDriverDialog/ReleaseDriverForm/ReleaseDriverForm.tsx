import {
  Box,
  Grid,
  MenuItem,
  TextField,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { AutocompleteDriver } from "@/components/AutocompleteDriver";
import { AutocompleteTruck } from "@/components/AutocompleteTruck";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { DateTimePicker } from "@mui/x-date-pickers";
import { AutocompleteJustification } from "@/components/AutocompleteJustification";
import { grey } from "@mui/material/colors";

dayjs.extend(customParseFormat);

export const ReleaseDriverForm = () => {
  const methods = useFormContext();
  const { control } = methods;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <Box display="flex" flexDirection="column" gap="20px">
        <Box display="flex" flexDirection="column" gap="10px">
          <Box display="flex" flexDirection="column">
            <Typography mb={1}>Planejado</Typography>
            <Grid container gap={1} display="flex">
              <Box sx={{ flexBasis: "135px" }}>
                <Controller
                  name="saida"
                  control={control}
                  render={({ field }) => {
                    return (
                      <TextField
                        disabled
                        sx={{
                          "& .MuiInputBase-input.Mui-disabled": {
                            WebkitTextFillColor: grey[700],
                            cursor: "not-allowed",
                            opacity: 1,
                          },
                        }}
                        label="SAIDA"
                        {...field}
                        value={field.value}
                      />
                    );
                  }}
                />
              </Box>
              <Box sx={{ flexBasis: "135px" }}>
                <Controller
                  name="entrega"
                  control={control}
                  render={({ field }) => {
                    return (
                      <TextField
                        disabled
                        sx={{
                          "& .MuiInputBase-input.Mui-disabled": {
                            WebkitTextFillColor: grey[700],
                            cursor: "not-allowed",
                            opacity: 1,
                          },
                        }}
                        label="ENTREGA"
                        {...field}
                        value={field.value}
                      />
                    );
                  }}
                />
              </Box>
              <Box sx={{ flexBasis: "135px" }}>
                <Controller
                  name="demanda"
                  control={control}
                  render={({ field }) => {
                    return (
                      <TextField
                        disabled
                        sx={{
                          "& .MuiInputBase-input.Mui-disabled": {
                            WebkitTextFillColor: grey[700],
                            cursor: "not-allowed",
                            opacity: 1,
                          },
                        }}
                        label="DEMANDA"
                        {...field}
                        value={field.value}
                      />
                    );
                  }}
                />
              </Box>
              <Box sx={{ flexBasis: "135px" }}>
                <Controller
                  name="destino"
                  control={control}
                  render={({ field }) => {
                    return (
                      <TextField
                        disabled
                        sx={{
                          "& .MuiInputBase-input.Mui-disabled": {
                            WebkitTextFillColor: grey[700],
                            cursor: "not-allowed",
                            opacity: 1,
                          },
                        }}
                        label="DESTINO"
                        {...field}
                        value={field.value}
                      />
                    );
                  }}
                />
              </Box>
              <Box sx={{ flexBasis: "170px" }}>
                <AutocompleteDriver
                  label={"Motorista Planejado"}
                  disabled
                  name="motoristaPlan"
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      WebkitTextFillColor: grey[700],
                      cursor: "not-allowed",
                      opacity: 1,
                    },
                  }}
                  onChange={(value) => {
                    methods.setValue("motoristaPlan", value?.nickName);
                  }}
                />
              </Box>
              <Box sx={{ flexBasis: "170px" }}>
                <AutocompleteTruck
                  label="Veículo Planejado"
                  name="veiculoPlan"
                  disabled
                  onChange={(value) => {
                    methods.setValue("veiculoPlan", value?.licensePlate);
                  }}
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      WebkitTextFillColor: grey[700],
                      cursor: "not-allowed",
                      opacity: 1,
                    },
                  }}
                />
              </Box>
            </Grid>
          </Box>
          <Box display="flex" flexDirection="column">
            <Typography mb={1}>Liberado</Typography>
            <Grid container gap={1}>
              <Grid item xs={2}>
                <AutocompleteDriver
                  label="Motorista liberado"
                  name="motoristaLiberado"
                  onChange={(value) => {
                    methods.setValue("motoristaLiberado", value?.nickName);
                  }}
                />
              </Grid>
              <Grid item xs={2}>
                <AutocompleteTruck
                  label="Veículo Liberado"
                  name="veiculoLiberado"
                  onChange={(value) => {
                    methods.setValue("veiculoLiberado", value?.licensePlate);
                  }}
                />
              </Grid>
              <Grid item xs={2}>
                <AutocompleteJustification />
              </Grid>
              <Grid item xs={2}>
                <Controller
                  name="presentationDate"
                  control={control}
                  render={({ field }) => {
                    return (
                      <DateTimePicker
                        label="Data da Apresentação"
                        {...field}
                        value={field.value}
                      />
                    );
                  }}
                />
              </Grid>
            </Grid>
          </Box>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight={500}>Mains informações</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container gap={1}>
                <Box sx={{ flexBasis: "135px" }}>
                  <Controller
                    name="mdfe"
                    control={control}
                    render={({ field }) => {
                      return (
                        <TextField
                          sx={{
                            "& .MuiInputBase-input.Mui-disabled": {
                              WebkitTextFillColor: "#000000",
                              opacity: 1,
                            },
                          }}
                          label="MDFE"
                          type="tel"
                          {...field}
                          value={field.value}
                          onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                            e.target.value = e.target.value
                              .slice(0, 12)
                              .replace(/\D/g, "");
                          }}
                          inputProps={{
                            maxLength: 12,
                          }}
                        />
                      );
                    }}
                  />
                </Box>
                <Box sx={{ flexBasis: "135px" }}>
                  <Controller
                    name="cte"
                    control={control}
                    render={({ field }) => {
                      return (
                        <TextField
                          sx={{
                            "& .MuiInputBase-input.Mui-disabled": {
                              WebkitTextFillColor: "#000000",
                              opacity: 1,
                            },
                          }}
                          label="CTE"
                          {...field}
                          type="tel"
                          value={field.value}
                          onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                            e.target.value = e.target.value
                              .slice(0, 10)
                              .replace(/\D/g, "");
                          }}
                          inputProps={{
                            maxLength: 10,
                          }}
                        />
                      );
                    }}
                  />
                </Box>
                <Box sx={{ flexBasis: "135px" }}>
                  <Controller
                    name="palletInvoice"
                    control={control}
                    render={({ field }) => {
                      return (
                        <TextField
                          label="Nota do Pallet"
                          {...field}
                          type="tel"
                          value={field.value}
                          inputProps={{
                            maxLength: 10,
                          }}
                        />
                      );
                    }}
                  />
                </Box>
                <Box sx={{ flexBasis: "135px" }}>
                  <Controller
                    name="productInvoice"
                    control={control}
                    render={({ field }) => {
                      return (
                        <TextField
                          label="Nota do produto"
                          {...field}
                          type="tel"
                          value={field.value}
                          inputProps={{
                            maxLength: 10,
                          }}
                        />
                      );
                    }}
                  />
                </Box>
                <Box sx={{ flexBasis: "165px" }}>
                  <Controller
                    name={"isReturnLoaded"}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        label="Retorno Carregado?"
                        select
                        sx={{
                          width: "100%",
                        }}
                        defaultValue={"false"}
                        {...field}
                        onChange={(value) => {
                          methods.setValue(
                            "isReturnLoaded",
                            value?.target.value,
                          );
                        }}
                      >
                        <MenuItem value={"false"}>Não</MenuItem>
                        <MenuItem value={"true"}>Sim</MenuItem>
                      </TextField>
                    )}
                  />
                </Box>
                <Box sx={{ flexBasis: "135px" }}>
                  <Controller
                    name="licensePlateTrailer"
                    control={control}
                    render={({ field, fieldState }) => {
                      return (
                        <TextField
                          required={false}
                          error={fieldState.error ? true : false}
                          sx={{
                            width: "100%",
                            "& .MuiInputBase-input.Mui-disabled": {
                              WebkitTextFillColor: "#000000",
                              opacity: 1,
                            },
                          }}
                          label="Placa da Carreta"
                          {...field}
                          value={field.value}
                          inputProps={{ maxLength: 50 }}
                          onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                            e.target.value = e.target.value
                              .replace(/[^A-Za-z0-9]/, "")
                              .toUpperCase();
                            const matchs = Array.from(
                              e.target.value.matchAll(
                                /([A-z]{3})(\d)([A-j0-9])(\d{2})/g,
                              ),
                            );
                            const partials = [];
                            if (matchs.length > 0) {
                              partials.push(matchs[0][1]);
                              if (!isNaN(Number.parseInt(matchs[0][3]))) {
                                partials.push("-");
                              }
                              partials.push(matchs[0][2]);
                              partials.push(matchs[0][3]);
                              partials.push(matchs[0][4]);
                              e.target.value = partials.join("").toUpperCase();
                            }

                            console.log(
                              !RegExp(/[A-z]{3}-*\d[A-j0-9]\d{2}/).exec(
                                e.target.value,
                              ),
                            );
                          }}
                        />
                      );
                    }}
                  />
                </Box>
                <Box sx={{ flexBasis: "385px" }}>
                  <Controller
                    name="note"
                    control={control}
                    render={({ field }) => {
                      return (
                        <TextField
                          sx={{
                            width: "100%",
                            "& .MuiInputBase-input.Mui-disabled": {
                              WebkitTextFillColor: "#000000",
                              opacity: 1,
                            },
                          }}
                          label="Observações"
                          {...field}
                          value={field.value}
                          inputProps={{ maxLength: 50 }}
                          onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                            e.target.value = e.target.value.slice(0, 50);
                          }}
                        />
                      );
                    }}
                  />
                </Box>

                <Box sx={{ flexBasis: "200px" }}>
                  <Controller
                    name="issueDate"
                    control={control}
                    render={({ field }) => {
                      return (
                        <DateTimePicker
                          label="Data da emissão da NF"
                          {...field}
                          value={field.value}
                        />
                      );
                    }}
                  />
                </Box>
                <Box sx={{ flexBasis: "280px" }}>
                  <Controller
                    name="issueResponsible"
                    control={control}
                    render={({ field }) => {
                      return (
                        <TextField
                          label="Responsável pela emissão da NF"
                          {...field}
                          sx={{
                            width: "100%",
                          }}
                          type="tel"
                          value={field.value}
                          inputProps={{
                            maxLength: 200,
                          }}
                        />
                      );
                    }}
                  />
                </Box>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Box>
      </Box>
      <Box gap="10px" display="flex" flexDirection="column"></Box>
    </LocalizationProvider>
  );
};
