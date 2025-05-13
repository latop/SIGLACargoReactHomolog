"use client";

import { Timezone } from "@/interfaces/parameters";
import { GridColDef, GridDeleteForeverIcon } from "@mui/x-data-grid";
import dayjs from "dayjs";
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
}: ColumnsConfigProps): GridColDef[] =>
  [
    {
      field: "timezone",
      headerName: "Fuso Horário",
      flex: 1,
      minWidth: 150,
      renderCell: (params: { row: { timezone: Timezone } }) => {
        return params.row.timezone.code;
      },
    },
    {
      field: "value",
      headerName: "Valor",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "start",
      headerName: "Data Início",
      flex: 1,
      minWidth: 150,
      renderCell: (params: { row: { start: string } }) => {
        return dayjs(params.row.start).format("DD/MM/YYYY");
      },
    },
    {
      field: "end",
      headerName: "Data Fim",
      flex: 1,
      minWidth: 150,
      renderCell: (params: { row: { end: string } }) => {
        return dayjs(params.row.end).format("DD/MM/YYYY");
      },
    },
    {
      field: "actions",
      headerName: " ",
      flex: 1,
      minWidth: 150,
      sortable: false,
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
