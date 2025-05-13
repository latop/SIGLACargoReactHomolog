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
  openDialog,
  handleDelete,
  isLoadingDelete,
  closeDialog,
}: ColumnsConfigProps): GridColDef[] =>
  [
    {
      field: "code",
      headerName: "Código",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "description",
      headerName: "Descrição",
      flex: 2,
      minWidth: 300,
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
