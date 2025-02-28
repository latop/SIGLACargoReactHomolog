import { useDriverDialog } from "@/components/DriverDialog/useDriverDialog";
import { useFormContext } from "react-hook-form";

export function useAddBaseSection() {
  const { watch, setValue } = useFormContext();
  const { driverId } = useDriverDialog();
  const driverBases = watch("driverBases") ?? [];

  const handleAddStep = () => {
    driverBases.push({
      driverId: driverId ? driverId : "00000000-0000-0000-0000-000000000000",
      id: "00000000-0000-0000-0000-000000000000",
      locationGroupId: driverBases.locationGroupId,
      startDate: null,
      endDate: null,
    });
    setValue("driverBases", driverBases);
  };

  return {
    handleAddStep,
  };
}
