/* eslint-disable prettier/prettier */
"use client";

import { AppBar } from "@/components/AppBar";
import { EmptyResult } from "@/components/EmptyResult";
import { ErrorResult } from "@/components/ErrorResult";
import { GenerateDailyTripDialog } from "@/components/GenerateDailyTripDialog";
import { HeaderTitle } from "@/components/HeaderTitle/HeaderTitle";
import { MainContainer } from "@/components/MainContainer";
import { FetchDailyTripsParams, initialDataDailyTripsParams, useGetDailyTripsQuery } from "@/services/query/daily-trips";
import { Box, Button, Card, Menu, MenuItem } from "@mui/material";
import { DataGrid, GridRowSelectionModel } from "@mui/x-data-grid";
import { useState } from "react";
import { DailyTripDetailsDialog } from "./dailyTripDetails/dailyTripDetailsDialog";
import { DailyTripsFilterBar } from "./DailyTripsFilterBar";
import IsLoadingTable from "./isLoadindCard";

import ModalBatchCancelTrip from "./batch/cancel-trip";
import config from "./configs";
import { FieldValues } from "react-hook-form";
import ModalBatchAlterCompanyTrip from "./batch/change-company";
import ModalBatchAlterFleetTrip from "./batch/change-fleet";
import ModalBatchAlterDatesTrip from "./batch/change-dates";
import { DailyTripBatchChangePayload, useDailyTripBatchChange } from "@/services/mutation/daily-trips";
import { useToast } from "@/hooks/useToast";

export function DailyTrips() {
  const [filters, setFilters] = useState<FetchDailyTripsParams>(initialDataDailyTripsParams)
  const [dailyTripModalIsOpen, setDailyTripModalIsOpen] = useState(false)
  const [batchCancelModal, setBatchCancelModal] = useState(false)
  const [batchChangeCompanyModal, setBatchChangeCompanyModal] = useState(false)
  const [batchChangeFleetModal, setBatchChangeFleetModal] = useState(false)
  const [batchChangeDatesModal, setBatchChangeDatesModal] = useState(false)
  const [tripId, setTripId] = useState()
  const [generateDailyTripModalIsOpen, setGenerateDailyTripModalIsOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { addToast } = useToast();

  const open = Boolean(anchorEl);

  const [currentPage, setCurrentPage] = useState(0)
  const [rowSelectionModel, setRowSelectionModel] =
    useState<GridRowSelectionModel>([]);

  const { data, isLoading: queryIsLoading, refetch } = useGetDailyTripsQuery({ ...filters, pageNumber: currentPage + 1 });
  const { mutateAsync, isPending: mutationIsLoading } = useDailyTripBatchChange();

  const isLoading: boolean = queryIsLoading || mutationIsLoading;

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

  const handleBulkTripAction = async (values: FieldValues) => {

    const payload = {
      ...values,
      dailyTripId: rowSelectionModel
    }
    console.log("Bulk viagens", payload)

    const response = await mutateAsync(payload as DailyTripBatchChangePayload)
    console.log(response)
    if (response === 'Ok') {
      setRowSelectionModel([])
      addToast("Alteração salva com sucesso");
    } else {
      addToast("Erro ao salvar alteração", { type: "error" });
    }
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
                  <MenuItem onClick={() => setBatchCancelModal(true)}>
                    Cancelar Viagens
                  </MenuItem>
                  <MenuItem onClick={() => setBatchChangeCompanyModal(true)}>
                    Alterar Transportadora
                  </MenuItem>
                  <MenuItem onClick={() => setBatchChangeFleetModal(true)}>
                    Alterar Frota
                  </MenuItem>
                  <MenuItem onClick={() => setBatchChangeDatesModal(true)}>
                    Alterar Datas e Horários
                  </MenuItem>

                </Menu>
              </>
            )}
          </div>
        </Box>
        <Card
          sx={{
            width: "100%",
            height: "634px",
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
                className="blueColumnGrid"
                sx={{
                  width: '100%',
                  height: '650px',
                  '& .blueColumnHeaders, .MuiDataGrid-columnHeaderCheckbox ': {
                    backgroundColor: '#24438F',
                    color: 'white',
                  },
                  '& .MuiDataGrid-columnHeaderTitleContainerContent svg[data-testid="IndeterminateCheckBoxIcon"], .MuiDataGrid-columnHeaderTitleContainerContent svg[data-testid="CheckBoxOutlineBlankIcon"], .MuiDataGrid-columnHeaderTitleContainerContent svg[data-testid="CheckBoxIcon"]': {
                    fill: 'white'
                  }

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
      <ModalBatchCancelTrip
        isOpen={batchCancelModal}
        handleClose={() => setBatchCancelModal(false)}
        handleConfirm={handleBulkTripAction}
      />
      <ModalBatchAlterCompanyTrip
        isOpen={batchChangeCompanyModal}
        handleClose={() => setBatchChangeCompanyModal(false)}
        handleConfirm={handleBulkTripAction}
      />
      <ModalBatchAlterFleetTrip
        isOpen={batchChangeFleetModal}
        handleClose={() => setBatchChangeFleetModal(false)}
        handleConfirm={handleBulkTripAction}
      />
      <ModalBatchAlterDatesTrip
        isOpen={batchChangeDatesModal}
        handleClose={() => setBatchChangeDatesModal(false)}
        handleConfirm={handleBulkTripAction}
      />
    </MainContainer >
  );
}
