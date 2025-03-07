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
import { Avatar, Box, Button, Card, Divider, ListItemIcon, Menu, MenuItem } from "@mui/material";
import { DataGrid, GridRowSelectionModel } from "@mui/x-data-grid";
import { useState } from "react";
import { DailyTripsFilterBar } from "./DailyTripsFilterBar";
import IsLoadingTable from "./isLoadindCard";

import config from "./configs";
import Settings from "@mui/icons-material/Settings";

export function DailyTrips() {
  const [filters, setFilters] = useState<FetchDailyTripsParams>(initialDataDailyTripsParams)
  const [dailyTripModalIsOpen, setDailyTripModalIsOpen] = useState(false)
  const [tripId, setTripId] = useState()
  const [generateDailyTripModalIsOpen, setGenerateDailyTripModalIsOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const [currentPage, setCurrentPage] = useState(0)
  const [rowSelectionModel, setRowSelectionModel] =
    useState<GridRowSelectionModel>([]);

  const { data, isLoading, refetch } = useGetDailyTripsQuery({ ...filters, pageNumber: currentPage + 1 });


  const handleFilters = (filtersData: FetchDailyTripsParams) => {
    setFilters(filtersData)
    refetch()
  }

  const handleOpenBulkActions = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
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
          justifyContent="space-between"
          mt="25px"
          mb="10px"
          gap={1}
        ><div>
            <Button variant="outlined" size="small" onClick={() => setGenerateDailyTripModalIsOpen(true)} sx={{ marginRight: 1 }} >
              Gerar viagem diária
            </Button>
            <Button variant="outlined" size="small" onClick={() => {
              setTripId(undefined)
              setDailyTripModalIsOpen(true)
            }}>
              Adicionar viagem
            </Button>
          </div>
          <div>
            {rowSelectionModel.length > 0 && (
              <>
                <Button variant="outlined" size="small" onClick={handleOpenBulkActions}>
                  Ações em lote
                </Button>
                <Menu
                  anchorEl={anchorEl}
                  id="account-menu"
                  open={open}
                  onClose={handleClose}
                  onClick={handleClose}
                  slotProps={{
                    paper: {
                      elevation: 0,
                      sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                          width: 32,
                          height: 32,
                          ml: -0.5,
                          mr: 1,
                        },
                        '&::before': {
                          content: '""',
                          display: 'block',
                          position: 'absolute',
                          top: 0,
                          right: 14,
                          width: 10,
                          height: 10,
                          bgcolor: 'background.paper',
                          transform: 'translateY(-50%) rotate(45deg)',
                          zIndex: 0,
                        },
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <MenuItem onClick={handleClose}>
                    <Avatar /> Profile
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <Avatar /> My account
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleClose}>
                    Add another account
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                      <Settings fontSize="small" />
                    </ListItemIcon>
                    Settings
                  </MenuItem>
                  <MenuItem onClick={handleClose}>

                    Logout
                  </MenuItem>
                </Menu>
              </>
            )}
          </div>
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
          {(!data && !isLoading || data && data.data?.length === 0) && <EmptyResult />}
          {data?.stack && <ErrorResult />}
          {isLoading && <IsLoadingTable />}
          {data && data.data?.length > 0 &&
            <div style={{ height: "100%", width: "100%" }}>
              <DataGrid
                sx={{
                  width: '100%',
                  height: '650px',
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
                    paginationModel: { page: data.currentPage - 1, pageSize: 15 },
                  },
                }}
                onPaginationModelChange={(params) => {
                  setCurrentPage(params.page);
                }}
                paginationMode="server"
                rowCount={data.totalCount}
                pageSizeOptions={[15]}
                density="compact"
                checkboxSelection
                onRowSelectionModelChange={(newRowSelectionModel: GridRowSelectionModel) => {
                  setRowSelectionModel(newRowSelectionModel);
                }}
                rowSelectionModel={rowSelectionModel}
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
