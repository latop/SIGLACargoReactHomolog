import { useFormContext } from "react-hook-form";

export function useAddLineFormFooter() {
  const { watch, setValue } = useFormContext();

  const handleAddStep = () => {
    const lineSections = watch("lineSections") || [];

    lineSections?.push({
      lineId: "00000000-0000-0000-0000-000000000000",
      section: lineSections.length + 1,
      locationOrigId: lineSections.locationOrigId,
      locationOrig: null,
      locationDest: null,
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
