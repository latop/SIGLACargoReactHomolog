import { useFormContext } from "react-hook-form";

export function useJourneyFormFooter() {
  const { watch, setValue } = useFormContext();

  const handleAddTravel = () => {
    const tasksDriver = watch("tasksDriver");
    tasksDriver.push({
      seq: tasksDriver.length + 1,
      type: "V",
      demand: null,
      locOrig: null,
      locDest: null,
      lineCode: null,
      startPlanned: null,
      endPlanned: null,
      startActual: null,
      endActual: null,
    });
    setValue("tasksDriver", tasksDriver);
  };

  const handleAddActivity = () => {
    const tasksDriver = watch("tasksDriver");
    tasksDriver.push({
      seq: tasksDriver.length + 1,
      type: "A",
      activityId: null,
      activityCode: null,
      startPlanned: null,
      endPlanned: null,
      startActual: null,
      endActual: null,
    });
    setValue("tasksDriver", tasksDriver);
  };

  return {
    handleAddTravel,
    handleAddActivity,
  };
}
