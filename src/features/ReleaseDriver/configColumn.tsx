import { ReleaseDriverInterface } from "@/interfaces/release-driver";
import { GridColDef } from "@mui/x-data-grid";
import { IconButton } from "@mui/material";
import dayjs from "dayjs";
import { FaEdit } from "react-icons/fa";

interface ColumnsConfigProps {
  handleOpenDialog: (id: string) => void;
}

export const columnsConfig = ({
  handleOpenDialog,
}: ColumnsConfigProps): GridColDef[] => {
  return [
    {
      field: "saida",
      headerName: "SAÍDA",
      width: 140,
      sortable: false,
      filterable: false,
      valueGetter: (_, data: ReleaseDriverInterface) => {
        return data.saida ? data.saida : "";
      },
    },
    {
      field: "entrega",
      headerName: "ENTREGA",
      width: 140,
      sortable: false,
      filterable: false,
      valueGetter: (_, data: ReleaseDriverInterface) => {
        return data.entrega ? data.entrega : "";
      },
    },
    {
      field: "demanda",
      headerName: "DEMANDA",
      width: 150,
      sortable: false,
      filterable: false,
      valueGetter: (_, data: ReleaseDriverInterface) => {
        return data.demanda ? data.demanda : "";
      },
    },
    {
      field: "destino",
      headerName: "DESTINO",
      width: 110,
      sortable: false,
      filterable: false,
      valueGetter: (_, data: ReleaseDriverInterface) => {
        return data.destino ? data.destino : "";
      },
    },
    {
      field: "motoristaPlan",
      headerName: "MOT.PLAN.",
      width: 140,
      sortable: false,
      filterable: false,
      valueGetter: (_, data: ReleaseDriverInterface) => {
        return data.motoristaPlan ? data.motoristaPlan : "";
      },
    },
    {
      field: "veiculoPlan",
      headerName: "VEÍCULO PLAN.",
      width: 140,
      sortable: false,
      filterable: false,
      valueGetter: (_, data: ReleaseDriverInterface) => {
        return data.veiculoPlan ? data.veiculoPlan : "";
      },
    },
    {
      field: "dtCheckList",
      headerName: "CHECK-LIST",
      width: 140,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        if (
          params.row.dtCheckList === null ||
          params.row.dtCheckList === undefined
        )
          return (
            <IconButton
              onClick={() => handleOpenDialog(params.row.dailyTripSectionId)}
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                color: "#24438f",
                cursor: "pointer",
              }}
            >
              <FaEdit />
            </IconButton>
          );
        return params.row.dtCheckList;
      },
    },
    {
      field: "motoristaLiberado",
      headerName: "MOT.REAL.",
      width: 140,
      sortable: false,
      filterable: false,
      valueGetter: (_, data: ReleaseDriverInterface) => {
        return data.motoristaLiberado ? data.motoristaLiberado : "";
      },
    },
    {
      field: "veiculoLiberado",
      headerName: "VEÍCULO.REAL.",
      width: 150,
      sortable: false,
      filterable: false,
      valueGetter: (_, data: ReleaseDriverInterface) => {
        return data.veiculoLiberado ? data.veiculoLiberado : "";
      },
    },
    {
      field: "dtLiberacao",
      headerName: "LIBERAÇÃO",
      width: 140,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        return params.row.dtLiberacao
          ? dayjs(params.row.dtLiberacao).format("DD/MM/YYYY HH:mm")
          : "";
      },
    },
  ];
};
