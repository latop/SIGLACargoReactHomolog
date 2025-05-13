import {
  GridColDef,
  GridDeleteForeverIcon,
  GridRenderCellParams,
} from "@mui/x-data-grid";
import { ReactNode } from "react";

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
      width: 400,
    },
    {
      field: "flgDriverRequired",
      headerName: "Motorista Requerido",
      width: 150,
      renderCell: (params: GridRenderCellParams) => {
        return params.value ? "Sim" : "Não";
      },
    },
    {
      field: "color",
      headerName: "Cor",
      width: 50,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <div
            style={{
              paddingTop: 6,
            }}
          >
            <div
              style={{
                width: "20px",
                height: "20px",
                backgroundColor: `#${params.value}`,
                borderRadius: "50%",
                margin: "0 auto",
              }}
            />
          </div>
        );
      },
    },
    {
      field: " ",
      headerName: "",
      width: 100,
      renderCell: (params: { id: string }) => {
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <button
              disabled={isLoadingDelete}
              style={{
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
                      await handleDelete(params.id).then(() => {
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
          </div>
        );
      },
    },
  ].map((column) => ({ ...column })) as GridColDef[];
};
