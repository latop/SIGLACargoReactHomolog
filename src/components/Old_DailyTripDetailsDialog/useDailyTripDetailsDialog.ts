import { useEffect } from "react";
import { useDailyTripDetails } from "@/hooks/useDailyTripDetails/useDailyTripDetails";
import { useHash } from "@/hooks/useHash";
import { DailyTrip } from "@/interfaces/daily-trip";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";

export function Old_useDailyTripDetailsDialog() {
  const methods = useForm({
    defaultValues: {
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
    },
  });
  const { reset } = methods;
  const [hash] = useHash();
  const match = (hash as string)?.match(/#dailyTrip-(.+)/);
  const dailyTripId = match?.[1];
  const { dailyTripDetails, dailyTripSections, isLoading, error } =
    useDailyTripDetails({
      dailyTripId,
    });

  const normalizeData = (
    data: DailyTrip,
    dataDailyTripSections: DailyTrip[],
  ) => {
    const dailyTripDefaultValues = {
      tripNumber: data.tripNumber,
      tripDate: data.tripDate ? dayjs(data.tripDate).format("YYYY-MM-DD") : "",
      fleetGroupId: data.fleetGroupId,
      fleetGroup: data.fleetGroup,
      flgStatus: data.flgStatus,
      notes: data.notes,
      lineId: data.lineId,
      line: data.line,
      dt: data.dt,
      sto: data.sto,
      locationOrigId: data.locationOrigId,
      locationOrig: data.locationOrig,
      locationDestId: data.locationDestId,
      locationDest: data.locationDest,
      startPlanned: data.startPlanned
        ? dayjs(data.startPlanned).format("YYYY-MM-DDTHH:mm")
        : null,
      endPlanned: data.endPlanned
        ? dayjs(data.endPlanned).format("YYYY-MM-DDTHH:mm")
        : null,
      tripTypeId: data.tripTypeId,
      tripType: data.tripType,
      stopTypeId: data.stopTypeId,
      stopType: data.stopType,
      companyId: data.companyId,
      id: data.id,
      dailyTripSections: dataDailyTripSections.map((section) => ({
        ...section,
        startPlanned: section.startPlanned
          ? dayjs(section.startPlanned).format("YYYY-MM-DDTHH:mm")
          : null,
        endPlanned: section.endPlanned
          ? dayjs(section.endPlanned).format("YYYY-MM-DDTHH:mm")
          : null,
        startEstimated: section.startEstimated
          ? dayjs(section.startEstimated).format("YYYY-MM-DDTHH:mm")
          : null,
        endEstimated: section.endEstimated
          ? dayjs(section.endEstimated).format("YYYY-MM-DDTHH:mm")
          : null,
      })),
    };
    return dailyTripDefaultValues;
  };

  useEffect(() => {
    if (dailyTripDetails && dailyTripSections) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore next line
      reset(normalizeData(dailyTripDetails, dailyTripSections));
    }
  }, [dailyTripDetails, dailyTripSections]);

  return {
    dailyTripDetails,
    isLoading,
    error,
    methods,
  };
}
