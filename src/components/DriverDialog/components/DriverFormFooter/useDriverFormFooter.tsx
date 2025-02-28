import { useDriverDialog } from "../../useDriverDialog";
import { useAddAttribuitionSection } from "../DriverSections/Attribuitions/useAddAttribuitionSection";
import { useAddBaseSection } from "../DriverSections/Bases/useAddBasesSection";
import { useAddFleetSection } from "../DriverSections/Fleets/useAddFleetSection";
import { useAddPositionSection } from "../DriverSections/Positions/useAddPositionsSection";
import { useAddVacationSection } from "../DriverSections/Vacations/useAddVacationsSection";

export const useDriverFormFooter = () => {
  const { selectedTab } = useDriverDialog();
  const { handleAddStep: handleAddAttribuition } = useAddAttribuitionSection();
  const { handleAddStep: handleAddPosition } = useAddPositionSection();
  const { handleAddStep: handleAddFleet } = useAddFleetSection();
  const { handleAddStep: handleAddVacation } = useAddVacationSection();
  const { handleAddStep: handleAddBase } = useAddBaseSection();

  const handleAddStep = {
    driverAttributions: handleAddAttribuition,
    driverPositions: handleAddPosition,
    driverFleets: handleAddFleet,
    driverVacations: handleAddVacation,
    driverBases: handleAddBase,
  }[selectedTab];

  return {
    handleAddStep,
  };
};
