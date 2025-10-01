import useSWRMutation from "swr/mutation";
import { copyLineById } from "@/services/trips";
import { useToast } from "../useToast";

export const useCopyLine = () => {
  const { addToast } = useToast();

  const {
    trigger: triggerCopyLine,
    isMutating: isLoadingCopy,
    error,
  } = useSWRMutation(
    "/copyline",
    async (_, { arg }: { arg: { id: string } }) => await copyLineById(arg),
    {
      onSuccess: () => {
        addToast("Rota copiada com sucesso!", { type: "success" });
      },
      onError: () => {
        addToast("Erro ao copiar a rota.", { type: "error" });
      },
    },
  );

  const handleCopyLine = async (id: string, refetchLines?: () => void) => {
    try {
      await triggerCopyLine({ id });
      refetchLines?.();
    } catch (error) {
      console.error("Error copying line:", error);
    }
  };

  return {
    handleCopyLine,
    isLoadingCopy,
    error,
  };
};
