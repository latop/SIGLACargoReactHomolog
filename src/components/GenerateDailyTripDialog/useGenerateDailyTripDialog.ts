import { useFetch } from "@/hooks/useFetch";
import { useHash } from "@/hooks/useHash";
import { useToast } from "@/hooks/useToast";
import dayjs from "dayjs";
import { FieldValues, useForm } from "react-hook-form";

export const useGenerateDailyTrip = () => {
  const methods = useForm({
    defaultValues: {
      startDate: dayjs().format("YYYY-MM-DD"),
      endDate: dayjs().add(7, "day").format("YYYY-MM-DD"),
      locationGroupCode: "",
      fleetGroupCode: "",
    },
  });

  const [, setHash] = useHash();
  const [generateTrip, { loading: loadingGenerateTrip }] = useFetch();
  const { addToast } = useToast();
  const onSubmit = async (data: FieldValues) => {
    return await generateTrip("/DailyTrip/dailytripperiod", data, {
      onSuccess: () => {
        addToast("Viagem gerada com sucesso.", { type: "success" }),
          setHash("");
      },
      onError: () => addToast("Erro ao gerarviagem.", { type: "error" }),
    });
  };

  return {
    methods,
    handleSubmit: methods.handleSubmit(onSubmit),
    loadingGenerateTrip,
  };
};
