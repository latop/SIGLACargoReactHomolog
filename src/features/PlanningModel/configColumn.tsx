import { GridColDef } from "@mui/x-data-grid";
import { ReactNode } from "react";
import { PlanningModel } from "@/interfaces/planning";
import { ActionsColumn } from "@/components/ActionsColumn";
import dayjs from "dayjs";
import { Location } from "@/interfaces/trip";

interface DialogConfig {
  body?: ReactNode;
  onConfirm?: () => Promise<void>;
  onCancel?: () => void;
}

interface ColumnsConfigProps {
  closeDialog: () => void;
  openDialog: (config: DialogConfig) => void;
  handleDelete: (id: string) => Promise<void>;
  isLoadingDelete: boolean;
}

export const columnsConfig = ({
  closeDialog,
  openDialog,
  handleDelete,
  isLoadingDelete,
}: ColumnsConfigProps): GridColDef<PlanningModel>[] => [
  {
    field: "startDate",
    headerName: "Data Inicial",
    flex: 1,
    minWidth: 100,
    valueFormatter: (value) => dayjs(value).format("DD/MM/YYYY"),
  },
  {
    field: "endDate",
    headerName: "Data Final",
    flex: 1,
    minWidth: 100,
    valueFormatter: (value) => dayjs(value).format("DD/MM/YYYY"),
  },
  {
    field: "locationOrig",
    headerName: "Local de Origem",
    flex: 1,
    minWidth: 150,
    valueGetter: (value) => (value as Location)?.code,
  },
  {
    field: "locationDest",
    headerName: "Local de Destino",
    flex: 1,
    minWidth: 150,
    valueGetter: (value) => (value as Location)?.code,
  },
  {
    field: "freqMon",
    headerName: "Segunda",
    width: 100,
    type: "number",
  },
  {
    field: "freqTue",
    headerName: "Terça",
    width: 100,
    type: "number",
  },
  {
    field: "freqWed",
    headerName: "Quarta",
    width: 100,
    type: "number",
  },
  {
    field: "freqThu",
    headerName: "Quinta",
    width: 100,
    type: "number",
  },
  {
    field: "freqFri",
    headerName: "Sexta",
    width: 100,
    type: "number",
  },
  {
    field: "freqSat",
    headerName: "Sábado",
    width: 100,
    type: "number",
  },
  {
    field: "freqSun",
    headerName: "Domingo",
    width: 100,
    type: "number",
  },
  {
    field: "actions",
    headerName: "Ações",
    width: 100,
    sortable: false,
    renderCell: (params) => (
      <ActionsColumn
        onDelete={() => {
          openDialog({
            body: "Deseja apagar este registro?",
            onConfirm: async () => {
              await handleDelete(params.row.id);
              closeDialog();
            },
            onCancel: () => {
              closeDialog();
            },
          });
        }}
        isLoadingDelete={isLoadingDelete}
      />
    ),
  },
];
