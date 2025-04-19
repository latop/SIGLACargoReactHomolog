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
      field: "name",
      headerName: "Nome",
      width: 250,
    },
    {
      field: "code",
      headerName: "Código",
      width: 150,
      valueGetter: (_: unknown, params: { code: string }) => {
        return params?.code || "";
      },
    },
    {
      field: "state.name",
      headerName: "Estado",
      width: 150,
      valueGetter: (_: unknown, params: { state: { name: string } }) => {
        return params?.state?.name || "";
      },
    },
    {
      field: "state.code",
      headerName: "UF",
      width: 100,
      valueGetter: (_: unknown, params: { state: { code: string } }) =>
        params.state?.code || "",
    },
    {
      field: "country.name",
      headerName: "País",
      width: 150,
      valueGetter: (_: unknown, params: { country: { name: string } }) =>
        params.country?.name || "",
    },
    {
      field: "capital",
      headerName: "Capital",
      width: 100,
      valueGetter: (_: unknown, params: { capital: boolean }) =>
        params.capital ? "Sim" : "Não",
    },
    {
      field: "latitude",
      headerName: "Latitude",
      width: 120,
    },
    {
      field: "longitude",
      headerName: "Longitude",
      width: 120,
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
