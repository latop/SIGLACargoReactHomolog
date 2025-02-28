import dayjs from "dayjs";
import { useForm, FieldValues } from "react-hook-form";
import { useToast } from "@/hooks/useToast";
import { useVehiclePlannings } from "@/hooks/useVehiclePlannings";
import { useFetch } from "@/hooks/useFetch";

export function useGenerateVehiclePlanningDialog({
  onClose,
}: {
  onClose: () => void;
}) {
  const [generate] = useFetch();
  const { addToast } = useToast();
  const { refetch } = useVehiclePlannings();

  const onSubmit = async (data: FieldValues) => {
    await generate("/TruckAssignment/generatetruckassignments", data, {
      onSuccess: () => {
        addToast("Associações geradas com sucesso");
        refetch();
        onClose();
      },
      onError: () => {
        addToast("Erro ao criar viagem", { type: "error" });
      },
    });
  };
  const methods = useForm({
    defaultValues: {
      startDate: dayjs().format("YYYY-MM-DD"),
      endDate: dayjs().format("YYYY-MM-DD"),
      locationGroupCode: "",
      fleetGroupCode: "",
    },
  });
  return {
    methods,
    onSubmit,
  };
}
