import { GridColDef } from "@mui/x-data-grid";
import dayjs from "dayjs";
import ListAltIcon from "@mui/icons-material/ListAlt";
import MapIcon from "@mui/icons-material/Map";
import { ImportGtms } from "@/interfaces/trip";
import { ReactNode } from "react";
import { ActionsColumn } from "@/components/ActionsColumn";

interface DialogConfig {
  body?: ReactNode;
  onConfirm?: () => Promise<void>;
  onCancel?: () => void;
}

interface ColumnsConfigProps {
  handleImportedTrip: (id: string) => Promise<void>;
  closeDialog: () => void;
  openDialog: (config: DialogConfig) => void;
  handleDelete: (id: string) => Promise<void>;
  handleExport: (id: string, filename: string) => Promise<void>;
  isLoadingExport?: boolean;
}

export const columnsConfig = ({
  handleImportedTrip,
  handleDelete,
  closeDialog,
  openDialog,
  handleExport,
}: ColumnsConfigProps): GridColDef[] => [
  {
    field: "FileName",
    headerName: "Nome do Arquivo",
    width: 300,
    valueGetter: (_, data: ImportGtms) => {
      return data.FileName ? data.FileName.split(".xlsx")[0] : "";
    },
  },
  {
    field: "LocationCode",
    headerName: "Cód. Loc",
    width: 100,
  },
  {
    field: "CreateAt",
    headerName: "Data criação",
    width: 200,
    valueGetter: (_, data: ImportGtms) => {
      return dayjs(data.CreateAt).format("DD-MM-YY HH:mm");
    },
  },
  {
    field: "action",
    headerName: "Ações",
    width: 100,
    renderCell: (params) => (
      <ActionsColumn
        onDelete={() => {
          openDialog({
            body: "Deseja apagar este registro?",
            onConfirm: async () => {
              await handleDelete(params.id as string).then(() => {
                closeDialog();
              });
            },
            onCancel: () => {
              closeDialog();
            },
          });
        }}
        additionalActions={[
          {
            icon: <ListAltIcon color="success" />,
            onClick: () => handleImportedTrip(params.id as string),
            tooltip: "Listar",
          },
          {
            icon: <MapIcon color="primary" />,
            onClick: () =>
              handleExport(params.id as string, params.row.FileName as string),
            tooltip: "Baixar arquivo",
          },
        ]}
      />
    ),
  },
];
