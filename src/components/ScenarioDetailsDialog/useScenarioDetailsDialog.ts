import { useEffect } from "react";
import { useHash } from "@/hooks/useHash";
import { useForm } from "react-hook-form";
import { useScenarioDetails } from "@/hooks/useScenarioDetails";
import { Scenario } from "@/interfaces/planning";

export function useScenarioDetailsDialog() {
  const methods = useForm();
  const { reset } = methods;
  const [hash] = useHash();
  const match = (hash as string)?.match(/#scenario-(.+)/);
  const scenarioId = match?.[1];
  const { scenarioDetails, isLoading } = useScenarioDetails({
    id: scenarioId,
  });

  const { formState } = methods;
  const { defaultValues } = formState;
  const loading = isLoading || (scenarioDetails && !defaultValues?.id);

  const normalizeData = (data: Scenario) => {
    const scenarioDefaultValues = {
      id: data.id,
      code: data.code,
      description: data.description,
      isDated: data.isDated,
      isDefault: data.isDefault,
      startDate: data.startDate,
      endDate: data.endDate,
      // scenarioCapacities: dataSections.map((section) => ({
      //   ...section,
      // })),
    };
    return scenarioDefaultValues;
  };

  useEffect(() => {
    if (scenarioDetails) {
      reset(normalizeData(scenarioDetails));
    }
  }, [scenarioDetails]);

  return {
    isLoading: loading,
    methods,
    isEdit: !!scenarioId,
  };
}
