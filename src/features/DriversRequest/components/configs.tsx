import { DriverRequestResponse } from "@/services/query/drivers";
import { Box } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import dayjs from "dayjs";
import { CiCircleCheck, CiCircleRemove } from "react-icons/ci";

const headerClass = "blueColumnHeaders";

interface ColumnBuilder {
  handleChangeStatus: (id: string, status: string) => void;
}

export const status = {
  A: "Aprovado",
  D: "Negado",
  P: "Pendente",
} as { [key: string]: string };

const columns = ({ handleChangeStatus }: ColumnBuilder): GridColDef[] => {
  return [
    {
      field: "requestDate",
      headerName: "Data da Solicitação",
      width: 150,
      sortable: false,
      filterable: false,
      type: "singleSelect" as const,
      valueFormatter: (value: string) =>
        value ? dayjs(value).format("DD/MM/YYYY") : "",
    },
    {
      field: "",
      headerName: "Motorista",
      width: 200,
      sortable: false,
      filterable: false,
      type: "singleSelect" as const,
      valueGetter: (_: unknown, data: DriverRequestResponse) => {
        return data.driver.nickName ?? "";
      },
    },
    {
      field: "activityCode",
      headerName: "Atividade",
      width: 250,
      sortable: false,
      filterable: false,
      type: "singleSelect" as const,
      valueGetter: (_: unknown, data: DriverRequestResponse) => {
        return data.activity.code ?? "";
      },
    },
    {
      field: "activityTime",
      headerName: "Programação",
      width: 150,
      sortable: false,
      filterable: false,
      type: "singleSelect" as const,
      valueGetter: (_: unknown, data: DriverRequestResponse) => {
        return `${dayjs(data.activity.start).format("HH:mm")} - ${dayjs(
          data.activity.end,
        ).format("HH:mm")}`;
      },
    },
    {
      field: "notes",
      headerName: "Obs.",
      width: 250,
      sortable: false,
      filterable: false,
      type: "singleSelect" as const,
    },
    {
      field: "createAt",
      headerName: "Data do pedido",
      width: 150,
      sortable: false,
      filterable: false,
      type: "singleSelect" as const,
      valueFormatter: (value: string) =>
        value ? dayjs(value).format("DD/MM/YYYY HH:mm") : "",
    },
    {
      field: "flgStatus",
      headerName: "Status",
      width: 150,
      sortable: false,
      filterable: false,
      valueFormatter: (value: string) => status[value],
    },

    {
      field: "action",
      headerName: "Ações",
      width: 100,
      type: "singleSelect" as const,
      renderCell: (row: { row: { flgStatus: string }; id: string }) => {
        const flgStatus = row.row.flgStatus;

        return (
          <div>
            {!flgStatus && (
              <Box display={"flex"} gap={1}>
                <CiCircleCheck
                  color="green"
                  size={25}
                  title="Aprovar"
                  cursor={"pointer"}
                  onClick={() => handleChangeStatus(row.id, "A")}
                />
                <CiCircleRemove
                  color="red"
                  size={25}
                  title="Negar"
                  cursor={"pointer"}
                  onClick={() => handleChangeStatus(row.id, "D")}
                />
              </Box>
            )}
          </div>
        );
      },
    },
  ].map((column) => ({
    ...column,
    headerClassName: headerClass,
  })) as GridColDef[];
};

export default {
  columns,
};
