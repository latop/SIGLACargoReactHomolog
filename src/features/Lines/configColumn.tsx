import { ActionsColumn } from "@/components/ActionsColumn";
import { DailyTrip } from "@/interfaces/daily-trip";
import { GridColDef } from "@mui/x-data-grid";
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
  handleDelete: (id: string, refetchLines: () => void) => Promise<void>;
  isLoadingDelete: boolean;
  refetchLines: () => void;
}

export const columnsConfig = ({
  closeDialog,
  openDialog,
  handleDelete,
  isLoadingDelete,
  refetchLines,
}: ColumnsConfigProps): GridColDef[] => {
  return [
    {
      field: "line.code",
      headerName: "Cód. da Rota",
      width: 400,
      sortable: false,
      filterable: false,
      valueGetter: (_, data: DailyTrip) => {
        return data.line ? data?.line?.code : "";
      },
    },
    {
      field: "locationOrig.code",
      headerName: "Origem/Destino",
      width: 200,
      sortable: false,
      filterable: false,
      valueGetter: (_, data) => {
        return data.line.locationOrig && !!data.line.locationDest
          ? `${data?.line?.locationOrig?.code} / ${data?.line?.locationDest?.code}`
          : "";
      },
    },
    {
      field: "tripType.description",
      headerName: "Tipo de Viagem",
      width: 300,
      sortable: false,
      filterable: false,
      valueGetter: (_, data) => {
        return data?.line?.tripType?.description
          ? `${data?.line?.tripType?.description}`
          : "N/A";
      },
    },
    {
      field: "fleetGroup.code",
      headerName: "Cód. Da Frota",
      width: 200,
      sortable: false,
      filterable: false,
      valueGetter: (_, data) => {
        return data?.line?.fleetGroup?.code
          ? `${data?.line?.fleetGroup?.code}`
          : "N/A";
      },
    },
    {
      field: "qtdLineSections",
      headerName: "Seções",
      width: 100,
      sortable: false,
      filterable: false,
    },
    {
      field: "actions",
      headerName: "Ações",
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        return (
          <ActionsColumn
            onDelete={() => {
              openDialog({
                body: "Deseja apagar este registro?",
                onConfirm: async () => {
                  await handleDelete(params.id as string, refetchLines);
                  closeDialog();
                },
                onCancel: () => {
                  closeDialog();
                },
              });
            }}
            isLoadingDelete={isLoadingDelete}
          />
        );
      },
    },
  ];
};
