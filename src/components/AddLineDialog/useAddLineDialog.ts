import { useFetch } from "@/hooks/useFetch";
import { useHash } from "@/hooks/useHash";
import { useLines } from "@/hooks/useLines";
import { useToast } from "@/hooks/useToast";
import { useEffect } from "react";
import { FieldValues, useForm } from "react-hook-form";

export function useAddLineDialog() {
  const methods = useForm();

  const { addToast } = useToast();
  const [lineCreate, { loading }] = useFetch();
  const [hash, setHash] = useHash();
  const isAdd = !!(hash as string)?.match(/#add-line/);
  const { refetchLines } = useLines();
  useEffect(() => {
    if (isAdd) {
      methods.reset({
        line: {
          id: "00000000-0000-0000-0000-000000000000",
          code: "",
          description: "",
          startDate: "",
          endDate: "",
          freqMon: 1,
          freqTue: 1,
          freqWed: 1,
          freqThu: 1,
          freqFri: 1,
          freqSat: 1,
          freqSun: 1,
          overtimeAllowed: 0,
          locationOrigId: "",
          locationDestId: "",
          cost: 0,
          fleetGroupId: "",
          fleetGroup: "",
          tripTypeId: "",
          tripType: "",
          locationDest: "",
          locationOrig: "",
        },
        lineSections: [],
      });
    }
  }, [isAdd]);

  const handleSubmit = async (data: FieldValues) => {
    const body = {
      line: {
        ...data?.line,
        freqFri: data?.line.freqFri ? 1 : 0,
        freqMon: data?.line.freqMon ? 1 : 0,
        freqSat: data?.line.freqSat ? 1 : 0,
        freqSun: data?.line.freqSun ? 1 : 0,
        freqThu: data?.line.freqThu ? 1 : 0,
        freqTue: data?.line.freqTue ? 1 : 0,
        freqWed: data?.line.freqWed ? 1 : 0,
        description: data?.line.description,
        code: data?.line?.code,
        tripType: data?.line?.tripType,
        tripTypeId: data?.line?.tripType?.id,
        locationOrigId: data?.line?.locationOrig?.id,
        locationDestId: data?.line?.locationDest?.id,
        fleetGroupId: data?.line?.fleetGroup?.id,
      },
      lineSections:
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data?.lineSections?.map((section: any) => ({
          ...section,
          duration: Number(section.duration),
        })) || [],
    };
    console.log("body", body);

    return await lineCreate("/updateline", body, {
      onSuccess: () => {
        addToast("Rota criada com sucesso!", { type: "success" });
        setHash("");
        refetchLines();
      },
      onError: (error) => addToast(error.message, { type: "error" }),
    });
  };

  return { methods, handleSubmit, loading };
}
