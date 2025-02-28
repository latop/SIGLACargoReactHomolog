import { useDriverDialog } from "@/components/DriverDialog/useDriverDialog";
import { useFormContext } from "react-hook-form";

export function useAddFleetSection() {
  const { watch, setValue } = useFormContext();
  const { driverId } = useDriverDialog();
  const driverFleets = watch("driverFleets") ?? [];
  const handleAddStep = () => {
    driverFleets.push({
      driverId: driverId ? driverId : "00000000-0000-0000-0000-000000000000",
      id: "00000000-0000-0000-0000-000000000000",
      fleetGroupId: driverFleets.fleetGroupId,
      startDate: null,
      endDate: null,
    });
    setValue("driverFleets", driverFleets);
  };

  return {
    handleAddStep,
  };
}
