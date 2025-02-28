/* eslint-disable prettier/prettier */
"use client";

import { AppBar } from "@/components/AppBar";
import { DailyTripDetailsDialog } from "./dailyTripDetails/dailyTripDetailsDialog";
import { EmptyResult } from "@/components/EmptyResult";
import { ErrorResult } from "@/components/ErrorResult";
import { GenerateDailyTripDialog } from "@/components/GenerateDailyTripDialog";
import { HeaderTitle } from "@/components/HeaderTitle/HeaderTitle";
import { MainContainer } from "@/components/MainContainer";
import { FetchDailyTripsParams, initialDataDailyTripsParams, useGetDailyTripsQuery } from "@/services/query/daily-trips";
import { Box, Button, Card } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useState } from "react";
import { DailyTripsFilterBar } from "./DailyTripsFilterBar";
import IsLoadingTable from "./isLoadindCard";

import config from "./configs";

export function DailyTrips() {
  const [filters, setFilters] = useState<FetchDailyTripsParams>(initialDataDailyTripsParams)
  const [dailyTripModalIsOpen, setDailyTripModalIsOpen] = useState(false)
  const [tripId, setTripId] = useState()
  const [generateDailyTripModalIsOpen, setGenerateDailyTripModalIsOpen] = useState(false)

  const [currentPage, setCurrentPage] = useState(0)

  const { data, isLoading, isError } = useGetDailyTripsQuery({ ...filters, pageNumber: currentPage + 1 });


  const handleFilters = (filtersData: FetchDailyTripsParams) => {
    setFilters(filtersData)
  }
  return (
    <MainContainer>
      <AppBar>
        <HeaderTitle>{config.title}</HeaderTitle>
      </AppBar>
      <Box
        sx={{
          width: "1400px",
          height: "100%",
          padding: "15px",
          margin: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <DailyTripsFilterBar onChange={handleFilters} />
        <Box
          display="flex"
          justifyContent="flex-end"
          mt="25px"
          mb="10px"
          gap={1}
        >
          <Button variant="outlined" size="small" onClick={() => setGenerateDailyTripModalIsOpen(true)} >
            Gerar viagem diária
          </Button>
          <Button variant="outlined" size="small" onClick={() => {
            setTripId(undefined)
            setDailyTripModalIsOpen(true)
          }}>
            Adicionar viagem
          </Button>
        </Box>
        <Card
          sx={{
            width: "100%",
            height: "635px",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >

          {!data || data.data.length === 0 && <EmptyResult />}
          {isError && <ErrorResult />}
          {isLoading && <IsLoadingTable />}
          {data && data.data.length > 0 &&
            <div style={{ height: "100%", width: "100%" }}>
              <DataGrid
                sx={{
                  width: '100%',
                  '& .blueColumnHeaders ': {
                    backgroundColor: '#24438F',
                    color: 'white'
                  },
                }}
                rows={data.data}
                localeText={{
                  noRowsLabel: "Nenhum registro encontrado",
                  columnMenuHideColumn: "Ocultar coluna",
                  columnsManagementShowHideAllText: "Mostrar/Ocultar todas",
                  columnMenuManageColumns: "Gerenciar colunas",
                  MuiTablePagination: {
                    labelRowsPerPage: "Registros por página",
                    labelDisplayedRows: ({ from, to, count }) =>
                      `${from}-${to} de ${count !== -1 ? count : `mais de ${to}`
                      }`,
                  },
                }}
                columns={config.columns}
                onCellDoubleClick={(params) => {
                  setTripId(params.row.id);
                  setDailyTripModalIsOpen(true);
                }}
                initialState={{
                  pagination: {
                    paginationModel: { page: data.currentPage - 1, pageSize: 10 },
                  },
                }}
                onPaginationModelChange={(params) => {
                  setCurrentPage(params.page);
                }}
                paginationMode="server"
                rowCount={data.totalCount}
                pageSizeOptions={[10]}
                density="compact"
              />
            </div>}
        </Card>
      </Box>
      <DailyTripDetailsDialog
        isOpen={dailyTripModalIsOpen}
        onClose={() => setDailyTripModalIsOpen(false)}
        id={tripId}
      />
      <GenerateDailyTripDialog isOpen={generateDailyTripModalIsOpen} onClose={() => setGenerateDailyTripModalIsOpen(false)} />
    </MainContainer >
  );
}
