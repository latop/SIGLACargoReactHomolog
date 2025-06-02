import { GridColDef } from "@mui/x-data-grid";
import { ReactNode } from "react";
import dayjs from "dayjs";
import { FetchOptmizedTripsData } from "@/interfaces/trip";
import { ActionsColumn } from "@/components/ActionsColumn";

interface DialogConfig {
  title?: string;
  message?: string;
  body?: ReactNode;
  onConfirm?: () => void;
  onCancel?: () => void;
}

interface ColumnsConfigProps {
  closeDialog: () => void;
  openDialog: (config: DialogConfig) => void;
  handleDelete?: (id: string) => Promise<void>;
  setHash: (hash: string) => void;
  isLoadingDelete?: boolean;
}

export const columnsConfig = ({
  closeDialog,
  openDialog,
  handleDelete,
  setHash,
  isLoadingDelete = false,
}: ColumnsConfigProps): GridColDef[] => {
  return [
    {
      field: "process",
      headerName: "Processo",
      width: 150,
    },
    {
      field: "createAt",
      headerName: "Iniciado em",
      width: 200,
      resizable: true,
      valueGetter: (_, data: FetchOptmizedTripsData) => {
        return dayjs(data.createAt).format("DD-MM-YY HH:mm");
      },
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
    },
    {
      field: "details",
      headerName: "Ações",
      width: 100,

      renderCell: (params) => {
        return (
          <ActionsColumn
            isLoadingDelete={isLoadingDelete}
            onDelete={() => {
              openDialog({
                body: "Deseja deletar esta otimização?",
                onConfirm: async () => {
                  await handleDelete?.(params.row.id).then(() => {
                    closeDialog();
                  });
                },
              });
            }}
            onEdit={() => setHash(`#otmId-${params.row.id}`)}
          />
        );
      },
    },
  ];
};
