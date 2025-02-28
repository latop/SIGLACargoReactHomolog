import { useFormContext } from "react-hook-form";

export function useScenarioFormFooter() {
  const { watch, setValue } = useFormContext();

  const handleAddScenarioCapacity = () => {
    const scenarioCapacities = watch("scenarioCapacities") || [];
    scenarioCapacities.push({
      // seq: scenarioCapacities.length + 1,
      line: {
        code: null,
      },
      lineId: null,
      mon: 0,
      startTimeMon: "",
      tue: 0,
      startTimeTue: "",
      wed: 0,
      startTimeWed: "",
      thu: 0,
      startTimeThu: "",
      fri: 0,
      startTimeFri: "",
      sat: 0,
      startTimeSat: "",
      sun: 0,
      startTimeSun: "",
    });
    setValue("scenarioCapacities", scenarioCapacities);
  };

  return {
    handleAddScenarioCapacity,
  };
}
