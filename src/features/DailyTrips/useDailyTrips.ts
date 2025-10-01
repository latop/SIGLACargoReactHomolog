import { useToast } from "@/hooks/useToast";
import {
  DailyTripBatchChangePayload,
  useDailyTripBatchChange,
} from "@/services/mutation/daily-trips";
import { useGetDailyTripsQuery } from "@/services/query/daily-trips";
import { GridRowSelectionModel } from "@mui/x-data-grid";
import dayjs from "dayjs";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { FieldValues } from "react-hook-form";
import { useHash } from "@/hooks/useHash/useHash";

export const useDailyTrips = () => {
  const [hash, setHash] = useHash();
  const [batchCancelModal, setBatchCancelModal] = useState(false);
  const [batchChangeCompanyModal, setBatchChangeCompanyModal] = useState(false);
  const [batchChangeFleetModal, setBatchChangeFleetModal] = useState(false);
  const [batchChangeDatesModal, setBatchChangeDatesModal] = useState(false);

  const isToAddDailyTrip = hash?.match(/#add-dailyTrip/);
  const dailyTripId = hash?.match(/#dailyTrip-(.+)/)?.[1];

  const dailyTripModalIsOpen = Boolean(isToAddDailyTrip || dailyTripId);
  const [generateDailyTripModalIsOpen, setGenerateDailyTripModalIsOpen] =
    useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { addToast } = useToast();
  const open = Boolean(anchorEl);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowSelectionModel, setRowSelectionModel] =
    useState<GridRowSelectionModel>([]);

  const searchParams = useSearchParams();
  const params = {
    fleetGroupId: searchParams.get("fleetGroupId") || "", // Filter1Id
    locationOrigId: searchParams.get("locationOrigId") || "", // Filter2Id
    locationDestId: searchParams.get("locationDestId") || "", // Filter3Id
    tripTypeId: searchParams.get("tripTypeId") || "", // Filter4Id
    companyId: searchParams.get("companyId") || "", // Filter5Id
    lineId: searchParams.get("lineId") || "", // Filter6Id
    sto: searchParams.get("sto") || "", // Filter1String
    tripDate: searchParams.get("tripDate")
      ? dayjs(searchParams.get("tripDate")).toString()
      : undefined,
    flgStatus: searchParams.get("flgStatus") || "", // Filter3String
    licensePlate: searchParams.get("licensePlate") || "", // Filter4String
    nickName: searchParams.get("nickName") || "", // Filter5String
  };

  const {
    data,
    isLoading: queryIsLoading,
    error,
    refetch: refetchDailyTrips,
  } = useGetDailyTripsQuery({ ...params, pageNumber: currentPage + 1 });

  const { mutateAsync, isPending: mutationIsLoading } =
    useDailyTripBatchChange();

  const isLoading: boolean = queryIsLoading || mutationIsLoading;

  const handleOpenBulkActions = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleBulkTripAction = async (values: FieldValues) => {
    const payload = {
      ...values,
      dailyTripId: rowSelectionModel,
    };

    const response = await mutateAsync(payload as DailyTripBatchChangePayload);
    if (response === "Ok") {
      setRowSelectionModel([]);
      addToast("Alteração salva com sucesso");
    } else {
      addToast("Erro ao salvar alteração", { type: "error" });
    }
  };

  const handleAddDailyTrip = () => {
    setHash("#add-dailyTrip");
  };

  const handleEditDailyTrip = (id: string) => {
    setHash(`#dailyTrip-${id}`);
  };

  const handleCloseDailyTripModal = () => {
    setHash("");
  };

  return {
    dailyTripModalIsOpen,
    dailyTripId,
    handleAddDailyTrip,
    handleEditDailyTrip,
    handleCloseDailyTripModal,
    generateDailyTripModalIsOpen,
    setGenerateDailyTripModalIsOpen,
    batchCancelModal,
    setBatchCancelModal,
    batchChangeCompanyModal,
    setBatchChangeCompanyModal,
    batchChangeFleetModal,
    setBatchChangeFleetModal,
    batchChangeDatesModal,
    setBatchChangeDatesModal,
    data,
    isLoading,
    error,
    currentPage,
    setCurrentPage,
    rowSelectionModel,
    setRowSelectionModel,
    anchorEl,
    open,
    handleOpenBulkActions,
    handleClose,
    handleBulkTripAction,
    refetchDailyTrips,
  };
};
