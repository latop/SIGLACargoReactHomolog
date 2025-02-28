import { useHash } from "@/hooks/useHash";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";
import { useVehiclePlanningDetails } from "@/hooks/useVehiclePlanningDetails";

export function useVehiclePlanningAddDialog() {
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
  const [hash] = useHash();
  const match = (hash as string)?.match(/#vehiclePlanning-(.+)/);
  const vehiclePlanningId = match?.[1];
  const { vehiclePlanningDetails, isLoading, error } =
    useVehiclePlanningDetails({ id: vehiclePlanningId });

  return {
    vehiclePlanningDetails,
    isLoading,
    error,
    methods,
  };
}
