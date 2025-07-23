import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Tooltip, Typography } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useImportTripsDialog } from "./useImportTripsDialog";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import PushPinIcon from "@mui/icons-material/PushPin";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import LoadingTableSkeleton from "../LoadingTableSkeleton/LoadingTableSkeleton";
import { ImportGtm, ImportGtms } from "@/interfaces/trip";

dayjs.extend(customParseFormat);

interface LocationsDialogProps {
  open: boolean;
  onClose: () => void;
}

export function ImportTripsDialog({ open, onClose }: LocationsDialogProps) {
  const columnsHeader: GridColDef[] = [
    {
      field: "fileName",
      headerName: "Nome do Arquivo",
      width: 250,
    },
    {
      field: "locationCode",
      headerName: "Cód. Loc",
      width: 150,
    },
    {
      field: "createAt",
      headerName: "Data criação",
      width: 200,
      valueGetter: (_, data: ImportGtms) => {
        return dayjs(data.createAt).format("DD-MM-YY HH:mm");
      },
    },
  ];

  const columns: GridColDef[] = [
    {
      field: "origem",
      headerName: "Origem",
      width: 250,
      valueGetter: (_, row: ImportGtm) => {
        return `${row?.codOrigem} - ${row?.cdOrigem}`;
      },
    },
    {
      field: "destino",
      headerName: "Destino",
      width: 300,
      valueGetter: (_, row: ImportGtm) =>
        `${row?.codDestino} - ${row?.clienteCDV}`,
    },
    {
      field: "sto",
      headerName: "STO",
      width: 150,
    },
    {
      field: "dataColetaHora",
      headerName: "Data Coleta + Hora",
      width: 200,
      valueGetter: (_, row: ImportGtm) =>
        `${row?.dataColeta} ${row?.horaColeta || ""}`,
    },
    {
      field: "dataSaidaHora",
      headerName: "Data Saída + Hora",
      width: 200,
      valueGetter: (_, row: ImportGtm) =>
        `${row?.dataSaida} ${row?.horaSaida || ""}`,
    },
    {
      field: "dataEntregaHora",
      headerName: "Data Entrega + Hora",
      width: 200,
      valueGetter: (_, row: ImportGtm) =>
        `${row?.dataEntrega} ${row?.horaEntrega || ""}`,
    },
    {
      field: "dataSolicitacao",
      headerName: "Data de Solicitação",
      width: 180,
    },
    {
      field: "tipoCarga",
      headerName: "Tipo de Carga",
      width: 160,
    },
    {
      field: "observacoes",
      headerName: "Obs",
      width: 250,
    },
  ];

  const {
    tripGTMS,
    tripGTMSDetails,
    isLoading,
    setIsFullscreen,
    isFullscreen,
    isPinned,
    setIsPinned,
  } = useImportTripsDialog();

  const handleClose = () => {
    onClose();
  };

  const sxFullscreen = isFullscreen
    ? { height: "100vh", maxWidth: "100vw" }
    : { height: "600px", maxWidth: "100%" };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <Dialog
        onClose={handleClose}
        open={open}
        fullWidth
        PaperProps={{ sx: sxFullscreen }}
        fullScreen={isFullscreen}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          <Box display="flex" justifyContent={"space-between"}>
            <Typography variant="h5">
              {tripGTMS?.fileName?.split(".xlsx")[0]}
            </Typography>
            <Box>
              <Tooltip
                title={isPinned ? "Desfixar cabeçalho" : "Fixar cabeçalho"}
              >
                <IconButton
                  size="small"
                  sx={{
                    transform: isPinned ? "rotate(0deg)" : "rotate(45deg)",
                    transition: "all .3s ease-in-out",
                  }}
                  onClick={() => setIsPinned((prev) => !prev)}
                >
                  <PushPinIcon />
                </IconButton>
              </Tooltip>
              <IconButton
                aria-label="fullscreen"
                onClick={() => setIsFullscreen((prev) => !prev)}
                sx={{
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <Tooltip
                  title={isFullscreen ? "Fechar tela cheia" : "Tela cheia"}
                >
                  {!isFullscreen ? <FullscreenIcon /> : <FullscreenExitIcon />}
                </Tooltip>
              </IconButton>
              <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent
          dividers
          sx={{
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            overflow: "hidden",
          }}
        >
          {isLoading ? (
            <LoadingTableSkeleton length={10} />
          ) : (
            <Box
              sx={{
                flex: 1,
                overflow: "auto",
                position: "relative",
              }}
            >
              {/* Fixed Header Table (conditionally sticky) */}
              <Box
                sx={{
                  position: isPinned ? "sticky" : "static",
                  top: isPinned ? 0 : "auto",
                  zIndex: isPinned ? 10 : "auto",
                  backgroundColor: "background.paper",
                  opacity: isPinned ? 1 : 0,
                  height: isPinned ? "auto" : 0,
                  pointerEvents: isPinned ? "auto" : "none",
                  transition: "all 0.2s ease",
                  marginBottom: isPinned ? 2 : 0,
                }}
              >
                <DataGrid
                  columns={columnsHeader}
                  rows={tripGTMS ? [tripGTMS] : []}
                  getRowId={(row) => row.id}
                  density="compact"
                  pageSizeOptions={[1]}
                  hideFooter
                  autoHeight
                />
              </Box>

              <Box sx={{ minWidth: "1200px" }}>
                <DataGrid
                  columns={columns}
                  rows={tripGTMSDetails || []}
                  getRowId={(row) => row.id}
                  density="compact"
                  hideFooter
                  autoHeight={false}
                  sx={{ height: "100%" }}
                />
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </LocalizationProvider>
  );
}
