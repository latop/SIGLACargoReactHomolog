import { useEffect } from "react";
import { useHash } from "@/hooks/useHash";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";
import { IVehiclePlanning } from "@/interfaces/vehicle";
import { useVehiclePlanningDetails } from "@/hooks/useVehiclePlanningDetails";

export function useVehiclePlanningUpdateDialog() {
  const methods = useForm({
    defaultValues: {
      id: "",
      driver: null,
      truck: null,
      truckId: "",
      startTime: dayjs().format("YYYY-MM-DDTHH:mm:ss"),
      endTime: dayjs().format("YYYY-MM-DDTHH:mm:ss"),
      startDate: dayjs().format("YYYY-MM-DD"),
      endDate: dayjs().format("YYYY-MM-DD"),
      freqTue: false,
      freqWed: false,
      freqThu: false,
      freqFri: false,
      freqSat: false,
      freqSun: false,
      freqMon: false,
    },
  });
  const { reset } = methods;
  const [hash] = useHash();
  const match = (hash as string)?.match(/#vehiclePlanning-(.+)/);
  const vehiclePlanningId = match?.[1];
  const { vehiclePlanningDetails, isLoading, error } =
    useVehiclePlanningDetails({ id: vehiclePlanningId });

  const normalizeData = (data: IVehiclePlanning) => {
    const vehiclePlanningDefaultValues = {
      id: data.id,
      driver: data.driver,
      truck: data.truck,
      startTime: data.startTime,
      endTime: data.endTime,
      startDate: data.startDate,
      endDate: data.endDate,
      freqTue: data.freqTue,
      freqWed: data.freqWed,
      freqThu: data.freqThu,
      freqFri: data.freqFri,
      freqSat: data.freqSat,
      freqSun: data.freqSun,
      freqMon: data.freqMon,
    };
    return vehiclePlanningDefaultValues;
  };

  useEffect(() => {
    if (vehiclePlanningDetails) {
      // eslint-disable-next-line react-hooks/exhaustive-deps, @typescript-eslint/ban-ts-comment
      // @ts-ignore
      reset(normalizeData(vehiclePlanningDetails));
    }
  }, [vehiclePlanningDetails]);

  return {
    vehiclePlanningDetails,
    isLoading,
    error,
    methods,
  };
}
