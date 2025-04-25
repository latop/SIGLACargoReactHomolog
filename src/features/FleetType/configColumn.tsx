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
      width: 200,
    },
    {
      field: "description",
      headerName: "Descrição",
      width: 200,
    },
    {
      field: "standardUnit",
      headerName: "Unidade Padrão",
      width: 150,
    },
    {
      field: "tare",
      headerName: "Tara",
      width: 100,
    },
    {
      field: "capacity",
      headerName: "Capacidade",
      width: 100,
    },
    {
      field: "fuelType",
      headerName: "Tipo de Combustível",
      width: 150,
    },
    {
      field: "steeringGearType",
      headerName: "Tipo de Direção",
      width: 150,
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
