import { Activity } from "@/interfaces/parameters";
import { GridColDef, GridDeleteForeverIcon } from "@mui/x-data-grid";
import dayjs from "dayjs";
import { ReactNode } from "react";

// const headerClassName = "blueColumnHeaders";

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
  handleDeleteActivity: (id: string) => Promise<void>;
  isLoadingDelete: boolean;
}

export const columnsConfig = ({
  closeDialog,
  openDialog,
  handleDeleteActivity,
  isLoadingDelete,
}: ColumnsConfigProps): GridColDef[] => {
  return [
    {
      field: "code",
      headerName: "Código",
      width: 120,
    },
    {
      field: "description",
      headerName: "Descrição",
      width: 150,
    },
    {
      field: "activityType.code",
      headerName: "Atividade",
      width: 100,
      valueGetter: (_: unknown, row: Activity) => {
        return row?.activityType?.code;
      },
    },
    {
      field: "startEnd",
      headerName: "Começo / Fim",
      width: 150,
      valueGetter: (_: unknown, row: Activity) => {
        return (
          dayjs(row?.start).format("HH:mm") +
          " / " +
          dayjs(row?.end).format("HH:mm")
        );
      },
    },
    {
      field: "flgActive",
      headerName: "Ativo",
      width: 100,
      valueGetter: (_: unknown, row: Activity) => {
        return row?.flgActive ? "Sim" : "Não";
      },
    },
    {
      field: "flgMeal",
      headerName: "Paga Ref.",
      width: 100,
      valueGetter: (_: unknown, row: Activity) => {
        return row?.flgMeal ? "Sim" : "Não";
      },
    },
    {
      field: "flgLunch",
      headerName: " Desc. Ref.",
      width: 100,
      valueGetter: (_: unknown, row: Activity) => {
        return row?.flgLunch ? "Sim" : "Não";
      },
    },
    {
      field: "flgRequest",
      headerName: "Pedido",
      width: 100,
      valueGetter: (_: unknown, row: Activity) => {
        return row?.flgRequest ? "Sim" : "Não";
      },
    },
    {
      field: "flgRest",
      headerName: "Descanso",
      width: 100,
      valueGetter: (_: unknown, row: Activity) => {
        return row?.flgRest ? "Sim" : "Não";
      },
    },
    {
      field: "flgAllowTimeChange",
      headerName: "Alt. Horário",
      width: 100,
      valueGetter: (_: unknown, row: Activity) => {
        return row?.flgAllowTimeChange ? "Sim" : "Não";
      },
    },
    {
      field: "qtyMaxMinutes",
      headerName: "Duração Máx",
      width: 50,
      valueGetter: (_: unknown, row: Activity) => {
        return row?.qtyMaxMinutes ? row?.qtyMaxMinutes : "0";
      },
    },
    {
      field: "qtyBlockBefore",
      headerName: "Blq. Antes",
      width: 50,
      valueGetter: (_: unknown, row: Activity) => {
        return row?.qtyBlockBefore ? row?.qtyBlockBefore : "0";
      },
    },
    {
      field: "qtyBlockAfter",
      headerName: "Blq. Depois",
      width: 50,
      valueGetter: (_: unknown, row: Activity) => {
        return row?.qtyBlockAfter ? row?.qtyBlockAfter : "0";
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
              paddingTop: 3,
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
                    await handleDeleteActivity(params?.id as string).then(
                      () => {
                        closeDialog();
                      },
                    );
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
