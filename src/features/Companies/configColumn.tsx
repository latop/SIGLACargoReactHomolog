import { GridColDef, GridDeleteForeverIcon } from "@mui/x-data-grid";
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
      width: 150,
      valueGetter: (_: unknown, params: { code: string }) => {
        return params?.code || "";
      },
    },
    {
      field: "name",
      headerName: "Nome",
      width: 250,
    },

    {
      field: "address",
      headerName: "Endereço",
      width: 300,
      valueGetter: (_: unknown, params: { address: string }) => {
        return params?.address || "";
      },
    },
    {
      field: "isSupplier",
      headerName: "Fornecedor",
      width: 120,
      valueGetter: (_: unknown, params: { isSupplier: boolean }) => {
        return params?.isSupplier ? "Sim" : "Não";
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
