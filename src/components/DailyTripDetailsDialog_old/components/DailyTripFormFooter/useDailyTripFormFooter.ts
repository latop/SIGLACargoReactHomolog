import { useFormContext } from "react-hook-form";

export function useDailyTripFormFooter() {
  const { watch, setValue } = useFormContext();

  const handleAddStep = () => {
    const dailyTripSections = watch("dailyTripSections");
    dailyTripSections.push({
      section: dailyTripSections.length + 1,
      truck: null,
      truckId: null,
      locationOrig: null,
      locationOrigId: null,
      locationDest: null,
      locationDestId: null,
      startActual: null,
      endActual: null,
      startEstimated: null,
      endEstimated: null,
      startPlanned: null,
      endPlanned: null,
      driverId: null,
      driverName: null,
    });
    setValue("dailyTripSections", dailyTripSections);
  };

  return {
    handleAddStep,
  };
}
