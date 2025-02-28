import { useFormContext } from "react-hook-form";

export function useUpdateLineFormFooter() {
  const { watch, setValue } = useFormContext();

  const handleAddStep = () => {
    const lineSections = watch("lineSections");

    lineSections.push({
      lineId: "00000000-0000-0000-0000-000000000000",
      section: lineSections.length + 1,
      locationOrigId: lineSections.locationOrigId,
      locationDestId: lineSections.locationDestId,
      duration: null,
      stopType: null,
    });
    setValue("lineSections", lineSections);
  };

  return {
    handleAddStep,
  };
}
