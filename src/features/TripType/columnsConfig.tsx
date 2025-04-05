import { TripType } from "@/interfaces/trip";
import { colorHex } from "@/utils";
import { GridColDef, GridDeleteForeverIcon } from "@mui/x-data-grid";
import { ReactNode } from "react";

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
  handleDeleteTripType: (id: string) => Promise<void>;
  isLoadingDelete: boolean;
}

export const columnsConfig = ({
  closeDialog,
  openDialog,
  handleDeleteTripType,
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
      field: "isLoaded",
      headerName: "Tem carga",
      width: 200,
      valueGetter: (_: unknown, row: TripType) => {
        return row.isLoaded ? "Sim" : "Não";
      },
    },
    {
      field: "color",
      headerName: "Cor",
      width: 100,
      renderCell: (params: { row: { colorRGB: string } }) => {
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
                background: `#${colorHex(params.row.colorRGB)}`,
                borderRadius: "50%",
                border: "1px solid #cfd8dc",
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
              paddingTop: 12,
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
                    await handleDeleteTripType(params?.id as string).then(
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
