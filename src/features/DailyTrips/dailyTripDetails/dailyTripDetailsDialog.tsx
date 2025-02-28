import { useGetDailyTripDetailQuery } from "@/services/query/daily-trips";
import Dialog from "@mui/material/Dialog";
import IsLoadingTable from "../isLoadindCard";
import { DailyTripFormDetail } from "./form/formDetail";

interface DailyTripDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  id?: string;
}

export function DailyTripDetailsDialog({
  isOpen,
  onClose,
  id,
}: DailyTripDetailsProps) {
  const { data, isLoading } = useGetDailyTripDetailQuery({ dailyTripId: id });

  const defaultValues = {
    tripNumber: "",
    tripDate: "",
    fleetGroupId: "",
    fleetGroup: "",
    flgStatus: "",
    notes: "",
    lineId: "",
    line: "",
    dt: "",
    sto: "",
    locationOrigId: "",
    locationOrig: "",
    locationDestId: "",
    locationDest: "",
    startPlanned: null,
    endPlanned: null,
    tripTypeId: "",
    tripType: "",
    stopTypeId: "",
    stopType: "",
    companyId: "",
    id: "",
    dailyTripSections: [],
  };
  const initialValues =
    id && data
      ? {
          ...data.dailyTrip,
          dailyTripSections: data.dailyTripSections,
        }
      : defaultValues;

  return (
    <Dialog
      onClose={onClose}
      open={isOpen}
      fullWidth
      PaperProps={{ sx: { height: "100%", maxWidth: "1400px" } }}
    >
      {id && isLoading && <IsLoadingTable />}
      {!isLoading && (
        <div>
          <DailyTripFormDetail
            initialValues={initialValues}
            handleClose={onClose}
          />
        </div>
      )}
    </Dialog>
  );
}
