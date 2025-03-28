import { ActivityType } from "@/interfaces/parameters";
import { GridColDef, GridDeleteForeverIcon } from "@mui/x-data-grid";
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
  handleDeleteActivityType: (id: string) => Promise<void>;
  isLoadingDelete: boolean;
}

// color: z.string().min(1, {
//   message: "Obrigatório",
// }),

export const columnsConfig = ({
  closeDialog,
  openDialog,
  handleDeleteActivityType,
  isLoadingDelete,
}: ColumnsConfigProps): GridColDef[] => {
  return [
    {
      field: "code",
      headerName: "Código",
      width: 200,
    },
    {
      field: "description",
      headerName: "Descrição",
      width: 300,
    },
    {
      field: "function",
      headerName: "Função",
      width: 200,
    },
    {
      field: "flgJourney",
      headerName: "Jornada",
      width: 200,
      valueGetter: (_: unknown, row: ActivityType) => {
        return row.flgJourney ? "Sim" : "Nao";
      },
    },
    {
      field: "flgPayroll",
      headerName: "Folha de Pgto.",
      width: 200,
      valueGetter: (_: unknown, row: ActivityType) => {
        return row.flgPayroll ? "Sim" : "Nao";
      },
    },
    {
      field: "color",
      headerName: "Cor",
      width: 100,
      renderCell: (params: { row: { color: string } }) => {
        return (
          <div
            style={{
              paddingTop: 6,
            }}
          >
            <div
              style={{
                width: "25px",
                height: "25px",
                background: `${params.row.color}`,
                borderRadius: "50%",
              }}
            />
          </div>
        );
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
                    await handleDeleteActivityType(params?.id as string).then(
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
