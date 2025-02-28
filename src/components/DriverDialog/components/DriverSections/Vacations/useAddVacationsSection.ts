import { useDriverDialog } from "@/components/DriverDialog/useDriverDialog";
import { useMemo } from "react";
import { useFormContext } from "react-hook-form";

export function useAddVacationSection() {
  const { watch, setValue } = useFormContext();
  const { driverId, driverData } = useDriverDialog();
  const driverVacations = watch("driverVacations") ?? [];
  const driverName = useMemo(() => driverData?.name, [driverData?.name]);

  const handleAddStep = () => {
    driverVacations.push({
      driverName,
      driverId: driverId ? driverId : null,
      id: "00000000-0000-0000-0000-000000000000",
      startDate: null,
      endDate: null,
    });
    setValue("driverVacations", driverVacations);
  };

  return {
    handleAddStep,
  };
}
