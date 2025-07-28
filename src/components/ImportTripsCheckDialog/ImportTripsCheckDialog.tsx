import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Input,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Box,
  IconButton,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import { AutocompleteLocationGroup } from "@/components/AutocompleteLocationGroup/AutocompleteLocationGroup";
import { useToast } from "@/hooks/useToast";
import axios from "axios";
import { useForm, FormProvider, FieldValues } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { GridAddIcon } from "@mui/x-data-grid";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";

import api from "@/services/configs/api";

const labelStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  cursor: "pointer",
};

const schema = z.object({
  locationGroupCode: z.string().min(1, "Grupo de localização é obrigatório."),
  file: z.any({ required_error: "Arquivo é obrigatório." }),
});

interface ImportTripsCheckDialogProps {
  open: boolean;
  onClose: () => void;
  onRefreshItems: () => void;
}

export const ImportTripsCheckDialog: React.FC<ImportTripsCheckDialogProps> = ({
  open,
  onClose,
  onRefreshItems,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [stopErrors, setStopErrors] = useState<
    { sto: string; error: string }[]
  >([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const sxFullscreen = isFullscreen
    ? { height: "100vh", maxWidth: "100vw" }
    : { height: "600px", maxWidth: "1000px" };

  const { addToast } = useToast();

  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      locationGroupCode: "",
      file: null,
    },
  });

  const { handleSubmit, setValue } = methods;

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFiles = event.dataTransfer.files;
    if (droppedFiles.length > 0) {
      setFile(droppedFiles[0]);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const onClearFile = () => {
    setFile(null);
    setValue("locationGroupCode", "");
    setStopErrors([]);
  };
  const onSubmit = async (data: FieldValues) => {
    if (!file) {
      addToast("Selecione um arquivo.", { type: "error" });
      return;
    }

    const payload = {
      File: file,
      Locationcode: data.locationGroupCode,
    };

    try {
      setIsLoading(true);
      const response = await api.post("/importGTMSCheck", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        addToast("Arquivo enviado com sucesso!", { type: "success" });
        onClearFile();
        onClose();
        onRefreshItems();
        return;
      }
    } catch (error) {
      if (!axios.isAxiosError(error)) {
        addToast("Erro ao processar o arquivo.", { type: "error" });
        return;
      }

      const errorData = error.response?.data?.tripGTMSDetails;

      if (!errorData) {
        addToast("Erro ao processar o arquivo.", { type: "error" });
        return;
      }

      if (Array.isArray(errorData)) {
        const extractedErrors = errorData.map(
          (error: { sto: string; erro: string }) => ({
            sto: error.sto || "Vazio",
            error: error.erro || "Vazio",
          }),
        );
        setStopErrors(extractedErrors);
        return;
      }

      addToast(errorData.message || "Erro ao processar o arquivo.", {
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnClose = () => {
    onClose();
    onClearFile();
  };

  return (
    <Dialog
      onClose={handleOnClose}
      open={open}
      fullWidth
      PaperProps={{ sx: sxFullscreen }}
      fullScreen={isFullscreen}
    >
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
        Importação de Viagens
        <Box>
          <IconButton
            aria-label="fullscreen"
            onClick={() => setIsFullscreen((prev) => !prev)}
            sx={{
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <Tooltip title={isFullscreen ? "Fechar tela cheia" : "Tela cheia"}>
              {!isFullscreen ? <FullscreenIcon /> : <FullscreenExitIcon />}
            </Tooltip>
          </IconButton>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers sx={{ padding: "16px" }}>
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            style={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              gap: "16px",
            }}
          >
            {!isLoading && (
              <AutocompleteLocationGroup
                name="locationGroupCode"
                key={methods.watch("locationGroupCode")}
                onChange={(value) =>
                  setValue("locationGroupCode", value?.code || "")
                }
                label="Grupo de localização"
              />
            )}
            {!stopErrors.length && !isLoading && (
              <div
                onDrop={handleDrop}
                onDragOver={(e) => {
                  e.preventDefault();
                }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "16px",
                  border: "2px dashed #ccc",
                  padding: "20px",
                  textAlign: "center",
                  height: "100%",
                }}
              >
                {!file && (
                  <Box
                    display={"flex"}
                    flexDirection={"column"}
                    gap={"16px"}
                    alignItems={"center"}
                  >
                    <Typography color={"textSecondary"}>
                      Arraste e solte o arquivo aqui ou clique para selecionar
                    </Typography>

                    <CloudUploadIcon
                      fontSize="large"
                      color="disabled"
                      sx={{
                        width: "50px",
                        height: "50px",
                      }}
                    />
                    <Button color="primary" variant="outlined" size="large">
                      <label style={labelStyle}>
                        <Input
                          type="file"
                          sx={{ display: "none" }}
                          inputProps={{ accept: ".xlsx" }}
                          {...methods.register("file", {
                            onChange: handleFileChange,
                          })}
                        />
                        Selecionar arquivo
                        <GridAddIcon fontSize="small" />
                      </label>
                    </Button>
                  </Box>
                )}

                {file && <Typography>Arquivo: {file.name}</Typography>}
              </div>
            )}

            {isLoading && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  width: "100%",
                }}
              >
                <CircularProgress />
              </Box>
            )}

            {!!stopErrors.length && !isLoading && (
              <TableContainer
                component={Paper}
                sx={{
                  height: "100%",
                }}
              >
                <Table>
                  <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                    <TableRow>
                      <TableCell>STO</TableCell>
                      <TableCell>Error</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stopErrors
                      .filter(
                        (error) =>
                          error.error !== undefined && error.error !== null,
                      )
                      .map((error, index) => {
                        return (
                          <TableRow key={index}>
                            <TableCell>{error.sto}</TableCell>
                            <TableCell>{error.error}</TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
            <DialogActions
              sx={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px",
                width: "100%",
              }}
            >
              <Button
                onClick={onClearFile}
                variant="contained"
                color="secondary"
                disabled={!file || isLoading}
              >
                Limpar
              </Button>

              <Box display={"flex"} gap="8px">
                <Button onClick={onClose}>Fechar</Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isLoading}
                >
                  Enviar
                </Button>
              </Box>
            </DialogActions>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};
