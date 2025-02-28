import { useDriverDialog } from "@/components/DriverDialog/useDriverDialog";
import { useFormContext } from "react-hook-form";

export function useAddPositionSection() {
  const { watch, setValue } = useFormContext();
  const { driverId } = useDriverDialog();
  const driverPositions = watch("driverPositions") ?? [];
  const handleAddStep = () => {
    driverPositions.push({
      driverId: driverId ? driverId : "00000000-0000-0000-0000-000000000000",
      id: "00000000-0000-0000-0000-000000000000",
      positionId: driverPositions.positionId,
      startDate: null,
      endDate: null,
    });
    setValue("driverPositions", driverPositions);
  };

  return {
    handleAddStep,
  };
}
