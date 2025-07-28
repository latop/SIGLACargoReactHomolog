import { useFetch } from "@/hooks/useFetch";
import { useHash } from "@/hooks/useHash";
import { useToast } from "@/hooks/useToast";
import { fetchTripTypeById } from "@/services/trips"; // Import the service
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import useSWR from "swr";
import { useTripType } from "@/features/TripType/useTripType";
import { colorHex, colorDecimal } from "@/utils";

export const tripTypeSchema = z.object({
  code: z
    .string()
    .min(1, { message: "Obrigatório" })
    .max(10, { message: "Máximo 10 caracteres." }),
  description: z.string().min(1, { message: "Obrigatório" }),
  isLoaded: z.boolean(),
  colorRGB: z.coerce.string().min(1, {
    message: "Obrigatório",
  }),
});

export type TripTypeFormType = z.infer<typeof tripTypeSchema>;

export const useTripTypeDialog = () => {
  const { refresh } = useTripType();
  const { addToast } = useToast();
  const [handleTripType, { error: errorTripType }] = useFetch();
  const [hash, setHash] = useHash();
  const isToAddTripType = !!(hash as string)?.match(/#add-trip-type/);
  const tripTypeId = (hash as string)?.match(/#trip-type-id-(.+)/)?.[1];

  const methods = useForm<TripTypeFormType>({
    resolver: zodResolver(tripTypeSchema),
    defaultValues: {
      code: "",
      description: "",
      isLoaded: false,
      colorRGB: "#000",
    },
  });

  const {
    data: tripType,
    error,
    isLoading,
  } = useSWR(
    tripTypeId ? { url: `/TripType/${tripTypeId}`, id: tripTypeId } : null,
    fetchTripTypeById,
    {
      onSuccess: (data) => {
        if (tripTypeId) {
          methods.reset({
            ...data,
            colorRGB: `#${colorHex(data.colorRGB)}`,
          });
        }
      },
      onError: () => {
        console.error(error);
      },
    },
  );

  const handleSubmit = async (data: TripTypeFormType) => {
    if (isToAddTripType) {
      await handleTripType(
        "/TripType",
        { ...data, colorRGB: colorDecimal(data.colorRGB) },
        {
          method: "post",
          onSuccess: () => {
            refresh();
            addToast("Tipo de viagem adicionado com sucesso!");
            setHash("");
          },
          onError: () => {
            addToast("Erro ao adicionar tipo de viagem.", { type: "error" });
            console.error(errorTripType);
          },
        },
      );
    }
    if (tripTypeId) {
      await handleTripType(
        `/TripType`,
        {
          ...data,
          id: tripTypeId,
          colorRGB: colorDecimal(data.colorRGB),
        },
        {
          method: "put",
          onSuccess: () => {
            refresh();
            addToast("Tipo de viagem atualizado com sucesso!");
            setHash("");
          },
          onError: () => {
            addToast("Erro ao atualizar tipo de viagem.", { type: "error" });
            console.error(errorTripType);
          },
        },
      );
    }
  };

  return {
    isToAddTripType,
    tripTypeId,
    methods,
    tripType,
    isLoading,
    handleSubmit: methods.handleSubmit(handleSubmit),
  };
};
