import dayjs from "dayjs";
import { GridColDef } from "@mui/x-data-grid";
import { DailyTrip } from "@/interfaces/daily-trip";

const title = "Viagens diáriass";

const headerClass = "blueColumnHeaders";

const columns: GridColDef[] = [
  {
    field: "tripDate",
    headerName: "Data da viagem",
    width: 150,
    sortable: false,
    filterable: false,
    valueFormatter: (value: string) =>
      value ? dayjs(value).format("DD/MM/YYYY") : "",
  },
  {
    field: "sto",
    headerName: "Sto",
    width: 150,
    sortable: false,
    filterable: false,
  },
  {
    field: "flgStatus",
    headerName: "Status",
    width: 100,
    sortable: false,
    filterable: false,
    valueFormatter: (value: string) => (value === "C" ? "CANCELADO" : "NORMAL"),
  },
  {
    field: "endPlanned",
    headerName: "Chegada Prevista",
    width: 150,
    sortable: false,
    filterable: false,
    valueFormatter: (value: string) =>
      value ? dayjs(value).format("DD/MM/YYYY HH:mm") : "",
  },
  {
    field: "startPlanned",
    headerName: "Saída Prevista",
    width: 150,
    sortable: false,
    filterable: false,
    valueFormatter: (value: string) =>
      value ? dayjs(value).format("DD/MM/YYYY HH:mm") : "",
  },

  {
    field: "locationOrig.code",
    headerName: "Origem",
    width: 150,
    sortable: false,
    filterable: false,
    valueGetter: (_: unknown, data: DailyTrip) => {
      return data.locationOrig ? data.locationOrig.code : "";
    },
  },
  {
    field: "locationDest.code",
    headerName: "Destino",
    width: 150,
    sortable: false,
    filterable: false,
    valueGetter: (_: unknown, data: DailyTrip) => {
      return data.locationDest ? data.locationDest.code : "";
    },
  },
  {
    field: "tripType.code",
    headerName: "Tipo de viagem",
    width: 150,
    sortable: false,
    filterable: false,
    valueGetter: (_: unknown, data: DailyTrip) => {
      return data.tripType ? data.tripType.code : "";
    },
  },

  {
    field: "lineCode",
    headerName: "Cód. Linha",
    width: 220,
    sortable: false,
    filterable: false,
    valueGetter: (_: unknown, data: DailyTrip) => {
      return data.line ? data.line.code : "";
    },
  },
].map((column) => ({ ...column, headerClassName: headerClass }));

export default {
  title,
  columns,
};
