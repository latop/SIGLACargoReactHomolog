"use client";

import { AppBar } from "@/components/AppBar";
import { EmptyResult } from "@/components/EmptyResult";
import { ErrorResult } from "@/components/ErrorResult";
import { GenerateDailyTripDialog } from "@/components/GenerateDailyTripDialog";
import { HeaderTitle } from "@/components/HeaderTitle/HeaderTitle";
import { MainContainer } from "@/components/MainContainer";

import { Box, Button, Card, Menu, MenuItem } from "@mui/material";
import { DataGrid, GridRowSelectionModel } from "@mui/x-data-grid";
import ModalBatchAlterCompanyTrip from "./batch/change-company";
import ModalBatchAlterDatesTrip from "./batch/change-dates";
import ModalBatchAlterFleetTrip from "./batch/change-fleet";
import ModalBatchCancelTrip from "./batch/cancel-trip";
import { columns } from "./configs";
import { DailyTripDetailsDialog } from "../../components/DailyTripsDetailsDialog/DailyTripDetailsDialog";
import { DailyTripsFilterBar } from "@/components/DailyTripsFilterBar/DailyTripsFilterBar";
import { useDailyTrips } from "./useDailyTrips";
import LoadingTableSkeleton from "@/components/LoadingTableSkeleton/LoadingTableSkeleton";

export function DailyTrips() {
  const {
    anchorEl,
    batchCancelModal,
    batchChangeCompanyModal,
    batchChangeDatesModal,
    batchChangeFleetModal,
    dailyTripModalIsOpen,
    data,
    error,
    generateDailyTripModalIsOpen,
    handleBulkTripAction,
    handleClose,
    handleOpenBulkActions,
    handleEditDailyTrip,
    handleCloseDailyTripModal,
    isLoading,
    open,
    rowSelectionModel,
    setBatchCancelModal,
    setBatchChangeCompanyModal,
    setBatchChangeDatesModal,
    setBatchChangeFleetModal,
    setCurrentPage,
    setGenerateDailyTripModalIsOpen,
    setRowSelectionModel,
  } = useDailyTrips();

  return (
    <MainContainer>
      <AppBar>
        <HeaderTitle>Viagens diárias</HeaderTitle>
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
        <DailyTripsFilterBar />
        <Box
          display="flex"
          justifyContent="space-between"
          mt="25px"
          mb="10px"
          gap={1}
        >
          <div>
            {rowSelectionModel.length > 0 && (
              <>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleOpenBulkActions}
                >
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
                        overflow: "visible",
                        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                        mt: 1.5,
                        "& .MuiAvatar-root": {
                          width: 32,
                          height: 32,
                          ml: -0.5,
                          mr: 1,
                        },
                        "&::before": {
                          content: '""',
                          display: "block",
                          position: "absolute",
                          top: 0,
                          right: 14,
                          width: 10,
                          height: 10,
                          bgcolor: "background.paper",
                          transform: "translateY(-50%) rotate(45deg)",
                          zIndex: 0,
                        },
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
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
          {((!data && !isLoading) || (data && data.data?.length === 0)) && (
            <EmptyResult />
          )}
          {error && <ErrorResult />}
          {isLoading && <LoadingTableSkeleton length={15} />}
          {data && data.data?.length > 0 && (
            <div style={{ height: "100%", width: "100%" }}>
              <DataGrid
                className="blueColumnGrid"
                sx={{
                  width: "100%",
                  height: "650px",
                  "& .blueColumnHeaders, .MuiDataGrid-columnHeaderCheckbox ": {
                    backgroundColor: "#24438F",
                    color: "white",
                  },
                  '& .MuiDataGrid-columnHeaderTitleContainerContent svg[data-testid="IndeterminateCheckBoxIcon"], .MuiDataGrid-columnHeaderTitleContainerContent svg[data-testid="CheckBoxOutlineBlankIcon"], .MuiDataGrid-columnHeaderTitleContainerContent svg[data-testid="CheckBoxIcon"]':
                    {
                      fill: "white",
                    },
                }}
                rows={data.data}
                getRowId={(row) => row.dailyTripId}
                localeText={{
                  noRowsLabel: "Nenhum registro encontrado",
                  columnMenuHideColumn: "Ocultar coluna",
                  columnsManagementShowHideAllText: "Mostrar/Ocultar todas",
                  columnMenuManageColumns: "Gerenciar colunas",
                  MuiTablePagination: {
                    labelRowsPerPage: "Registros por página",
                    labelDisplayedRows: ({ from, to, count }) =>
                      `${from}-${to} de ${
                        count !== -1 ? count : `mais de ${to}`
                      }`,
                  },
                }}
                columns={columns}
                onCellDoubleClick={(params) => {
                  handleEditDailyTrip(params.row.dailyTripId);
                }}
                initialState={{
                  pagination: {
                    paginationModel: {
                      page: data.currentPage - 1,
                      pageSize: 15,
                    },
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
                disableRowSelectionOnClick
                onRowSelectionModelChange={(
                  newRowSelectionModel: GridRowSelectionModel,
                ) => {
                  setRowSelectionModel(newRowSelectionModel);
                }}
                rowSelectionModel={rowSelectionModel}
              />
            </div>
          )}
        </Card>
      </Box>
      <DailyTripDetailsDialog
        isOpen={dailyTripModalIsOpen}
        onClose={handleCloseDailyTripModal}
      />
      <GenerateDailyTripDialog
        isOpen={generateDailyTripModalIsOpen}
        onClose={() => setGenerateDailyTripModalIsOpen(false)}
      />
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
    </MainContainer>
  );
}
