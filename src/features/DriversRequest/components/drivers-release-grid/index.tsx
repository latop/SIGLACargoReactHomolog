import { DriverRequestResponse } from "@/services/query/drivers";
import { DataGrid } from "@mui/x-data-grid";
import config from "../configs";
interface Params {
  page: number;
  size: number;
  totalRecords: number;
  data?: DriverRequestResponse[];
  handleChangeStatus: (id: string, status: string) => void;
  handlePageChange: (page: number) => void;
  isLoading?: boolean;
}

const DriverReleaseGrid = ({
  data,
  page,
  // size,
  // totalRecords,
  handleChangeStatus,
  // handlePageChange,
  isLoading,
}: Params) => {
  const columns = config.columns({ handleChangeStatus });
  return (
    <>
      <DataGrid
        sx={{
          marginTop: "20px",
          width: "100%",
          height: "calc(100vh - 300px)",
          "& .blueColumnHeaders ": {
            backgroundColor: "#24438F",
            color: "white",
          },
        }}
        loading={isLoading}
        rows={data}
        localeText={{
          noRowsLabel: "Nenhum registro encontrado",
          columnMenuHideColumn: "Ocultar coluna",
          columnsManagementShowHideAllText: "Mostrar/Ocultar todas",
          columnMenuManageColumns: "Gerenciar colunas",
          MuiTablePagination: {
            labelRowsPerPage: "Registros por página",
            labelDisplayedRows: ({ from, to, count }) =>
              `${from}-${to} de ${count !== -1 ? count : `mais de ${to}`}`,
          },
        }}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: page - 1, pageSize: 15 },
          },
        }}
        onPaginationModelChange={(params) => {
          console.log("params", params);
          // handlePageChange(params.page);
        }}
        paginationMode="client"
        // rowCount={2000}
        pageSizeOptions={[15]}
        density="compact"
      />
    </>
  );
};

export default DriverReleaseGrid;
