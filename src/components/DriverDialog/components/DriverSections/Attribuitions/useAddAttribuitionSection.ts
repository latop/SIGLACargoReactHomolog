import { useDriverDialog } from "@/components/DriverDialog/useDriverDialog";
import { useFormContext } from "react-hook-form";

export function useAddAttribuitionSection() {
  const { watch, setValue } = useFormContext();
  const { driverId } = useDriverDialog();
  const driverAttributions = watch("driverAttributions") ?? [];
  const handleAddStep = () => {
    driverAttributions.push({
      driverId: driverId ? driverId : "00000000-0000-0000-0000-000000000000",
      id: "00000000-0000-0000-0000-000000000000",
      attributionId: null,
      startDate: null,
      endDate: null,
    });
    setValue("driverAttributions", driverAttributions);
  };

  return {
    handleAddStep,
  };
}
