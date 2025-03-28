import { StopType } from "@/interfaces/trip";
import { GridColDef, GridDeleteForeverIcon } from "@mui/x-data-grid";
import { ReactNode } from "react";
import duration from "dayjs/plugin/duration";
import dayjs from "dayjs";

dayjs.extend(duration);

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
  handleDelete: (id: string) => Promise<void>;
  isLoadingDelete: boolean;
}

export const columnsConfig = ({
  closeDialog,
  openDialog,
  handleDelete,
  isLoadingDelete,
}: ColumnsConfigProps): GridColDef[] => {
  return [
    {
      field: "stopTypeCode",
      headerName: "Código",
      width: 200,
    },
    {
      field: "stopTime",
      headerName: "Tempo de parada",
      width: 150,
      valueGetter: (_: unknown, row: StopType) => {
        return row.stopTime.toString().padStart(3, "0") + " min";
      },
    },
    {
      field: "flgJourney",
      headerName: "Jornada",
      width: 100,
      valueGetter: (_: unknown, row: StopType) => {
        return row.flgJourney === "S" ? "Sim" : "Não";
      },
    },
    {
      field: " ",
      headerName: "",
      width: 50,
      renderCell: (params: { id: string }) => {
        return (
          <button
            disabled={isLoadingDelete}
            style={{
              paddingTop: 6,
              display: "flex",
              gap: "8px",
              border: "none",
              background: "transparent",
            }}
          >
            <GridDeleteForeverIcon
              sx={{
                cursor: "pointer",
                color: "#e53935",
              }}
              onClick={() => {
                openDialog({
                  body: "Deseja apagar este registro?",
                  onConfirm: async () => {
                    await handleDelete(params?.id as string).then(() => {
                      closeDialog();
                    });
                  },
                  onCancel: () => {
                    closeDialog();
                  },
                });
              }}
            />
          </button>
        );
      },
    },
  ].map((column) => ({ ...column })) as GridColDef[];
};
