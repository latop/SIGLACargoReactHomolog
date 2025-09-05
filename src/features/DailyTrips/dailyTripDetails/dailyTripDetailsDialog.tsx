import { useGetDailyTripDetailQuery } from "@/services/query/daily-trips";
import Dialog from "@mui/material/Dialog";
import { DailyTripFormDetail } from "./form/formDetail";
import LoadingTableSkeleton from "@/components/LoadingTableSkeleton/LoadingTableSkeleton";

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
    justification: { description: "" },
    justificationId: "",
    dailyTripSections: [],
  };
  const initialValues =
    id && data
      ? {
          ...data.dailyTrip,
          dailyTripSections: data.dailyTripSections.map((section: object) => ({
            nickname: data.nickName,
            ...section,
          })),
        }
      : defaultValues;

  return (
    <Dialog
      onClose={onClose}
      open={isOpen}
      fullWidth
      PaperProps={{ sx: { height: "100%", maxWidth: "1400px" } }}
    >
      {id && isLoading && <LoadingTableSkeleton length={15} />}
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
