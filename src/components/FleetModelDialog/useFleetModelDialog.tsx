"use client";

import { useFleetModel } from "@/features/FleetModel/useFleetModel";
import { useFetch } from "@/hooks/useFetch";
import { useHash } from "@/hooks/useHash";
import { useToast } from "@/hooks/useToast";
import { FleetModel } from "@/interfaces/vehicle";
import { fetchFleetModelById } from "@/services/vehicles";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLayoutEffect } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import { z } from "zod";

export const fleetModelSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Obrigatório",
    })
    .max(50, {
      message: "Máximo 50 caracteres.",
    }),
  code: z
    .string()
    .min(1, {
      message: "Obrigatório",
    })
    .max(10, {
      message: "Máximo 10 caracteres.",
    }),
  fleetBrandId: z.string().min(1, {
    message: "Obrigatório",
  }),
  fleetBrand: z.object({
    name: z.string().optional(),
    code: z.string().optional(),
  }),
});

export type FleetModelFormType = z.infer<typeof fleetModelSchema>;

export const useFleetModelDialog = () => {
  const { refreshList } = useFleetModel();
  const methods = useForm<FleetModelFormType>({
    resolver: zodResolver(fleetModelSchema),
    defaultValues: {
      name: "",
      code: "",
      fleetBrandId: "",
    },
  });
  const { addToast } = useToast();
  const [handleFleetModel, { error: errorFleetModel }] = useFetch();

  const [hash, setHash] = useHash();

  const isToAddFleetModel = !!(hash as string)?.match(/#add-fleet-model/)?.[0];
  const fleetModelId = (hash as string)?.match(/#fleet-model-id-(.+)/)?.[1];

  const {
    data: fleetModel,
    error,
    isLoading,
  } = useSWR<FleetModel>(
    fleetModelId
      ? { url: `fleet-model-${fleetModelId}`, id: fleetModelId }
      : null,
    fetchFleetModelById,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      onSuccess: (data) => {
        if (fleetModelId) {
          methods.reset({
            name: data.name,
            code: data.code,
            fleetBrandId: data.fleetBrandId,
            fleetBrand: {
              name: data.fleetBrand.name,
              code: data.fleetBrand.code,
            },
          });
          return;
        }
        methods.reset({});
      },
      onError: () => {
        console.error(error);
      },
    },
  );

  const handleSubmit = async (data: FleetModelFormType) => {
    if (isToAddFleetModel) {
      const body = {
        ...data,
        fleetBrand: undefined,
      };
      await handleFleetModel("/FleetModel", body, {
        method: "post",
        onSuccess: () => {
          addToast("Modelo de frota adicionado com sucesso!");
          refreshList();
          setHash("");
        },
        onError: () => {
          addToast("Erro ao adicionar modelo de frota.", { type: "error" });
          console.error(errorFleetModel);
        },
      });
      return;
    }
    if (fleetModelId) {
      const body = {
        ...data,
        id: fleetModel?.id,
        fleetBrand: undefined,
      };

      await handleFleetModel("/FleetModel", body, {
        method: "put",
        onSuccess: () => {
          addToast("Modelo de frota atualizado com sucesso!");
          refreshList();
          setHash("");
        },
        onError: () => {
          addToast("Erro ao atualizar modelo de frota.", { type: "error" });
          console.error(errorFleetModel);
        },
      });
      return;
    }
  };

  useLayoutEffect(() => {
    if (isToAddFleetModel) {
      methods.reset();
    }
  }, [methods.reset, isToAddFleetModel]);
  return {
    isToAddFleetModel,
    fleetModelId,
    methods,
    fleetModel,
    isLoading,
    handleSubmit: methods.handleSubmit(handleSubmit),
  };
};
