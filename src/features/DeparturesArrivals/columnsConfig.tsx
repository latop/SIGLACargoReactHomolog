import { GridColDef } from "@mui/x-data-grid";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { Box } from "@mui/material";

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case "no horário":
      return "#4CAF50"; // Verde
    case "atrasado":
      return "#f44336"; // Vermelho
    case "adiantado":
      return "#9C27B0"; // Roxo
    default:
      return "inherit";
  }
};

const getDirectionLabel = (direction: string) => {
  switch (direction) {
    case "ARR":
      return {
        label: "Chegada",
        icon: <ArrowDownwardIcon sx={{ fontSize: 16 }} />,
      };
    case "DEP":
      return {
        label: "Partida",
        icon: <ArrowUpwardIcon sx={{ fontSize: 16 }} />,
      };
    default:
      return { label: direction, icon: null };
  }
};

export const columnsConfig = (): GridColDef[] => [
  {
    field: "sto",
    headerName: "STO",
    width: 140,
    renderCell: (params) => (params.row.sto ? params.row.sto : "-"),
  },
  { field: "locCode", headerName: "Cód. Localização", width: 150 },
  { field: "timePlanned", headerName: "Planejado", width: 150 },
  { field: "timeEstimated", headerName: "Estimado", width: 150 },
  {
    field: "statusTrip",
    headerName: "Status",
    width: 120,
    renderCell: (params) => (
      <Box
        style={{
          color: getStatusColor(params.value as string),
          fontWeight: "700",
        }}
      >
        {params.value}
      </Box>
    ),
  },
  {
    field: "direction",
    headerName: "Direção",
    width: 120,
    renderCell: (params) => {
      const { label, icon } = getDirectionLabel(params.value as string);
      return (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            fontWeight: "700",
          }}
        >
          {icon}
          {label}
        </Box>
      );
    },
  },
  { field: "nickName", headerName: "Motorista", width: 200 },
  { field: "licensePlate", headerName: "Placa do Veículo", width: 150 },
];
