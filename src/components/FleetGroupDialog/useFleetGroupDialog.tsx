"use client";

import { useFleetGroup } from "@/features/FleetGroup/useFleetGroup";
import { useFetch } from "@/hooks/useFetch";
import { useHash } from "@/hooks/useHash";
import { useToast } from "@/hooks/useToast";
import { FleetGroup } from "@/interfaces/vehicle";
import { fetchFleetGroupById } from "@/services/vehicles";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLayoutEffect } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import { z } from "zod";

export const fleetGroupSchema = z.object({
  code: z
    .string()
    .min(1, {
      message: "Obrigatório",
    })
    .max(10, {
      message: "Máximo 10 caracteres.",
    }),
  description: z
    .string()
    .min(1, {
      message: "Obrigatório",
    })
    .max(50, {
      message: "Máximo 50 caracteres.",
    }),
  qtyDemands: z.coerce.number().min(0, {
    message: "Deve ser maior ou igual a 0",
  }),
});

export type FleetGroupFormType = z.infer<typeof fleetGroupSchema>;

export const useFleetGroupDialog = () => {
  const { refreshList } = useFleetGroup();
  const methods = useForm<FleetGroupFormType>({
    resolver: zodResolver(fleetGroupSchema),
    defaultValues: {
      code: "",
      description: "",
      qtyDemands: 0,
    },
  });
  const { addToast } = useToast();
  const [handleFleetGroup, { error: errorFleetGroup }] = useFetch();

  const [hash, setHash] = useHash();

  const isToAddFleetGroup = !!(hash as string)?.match(/#add-fleet-group/)?.[0];
  const fleetGroupId = (hash as string)?.match(/#fleet-group-id-(.+)/)?.[1];

  const {
    data: fleetGroup,
    error,
    isLoading,
  } = useSWR<FleetGroup>(
    fleetGroupId
      ? { url: `fleet-group-${fleetGroupId}`, id: fleetGroupId }
      : null,
    fetchFleetGroupById,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      onSuccess: (data) => {
        if (fleetGroupId) {
          console.log(data);
          methods.reset({
            code: data.code,
            description: data.description,
            qtyDemands: data.qtyDemands,
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

  const handleSubmit = async (data: FleetGroupFormType) => {
    if (isToAddFleetGroup) {
      await handleFleetGroup("/FleetGroup", data, {
        method: "post",
        onSuccess: () => {
          addToast("Grupo de frota adicionado com sucesso!");
          refreshList();
          setHash("");
        },
        onError: () => {
          addToast("Erro ao adicionar grupo de frota.", { type: "error" });
          console.error(errorFleetGroup);
        },
      });
      return;
    }
    if (fleetGroupId) {
      const body = {
        ...data,
        id: fleetGroup?.id,
      };

      await handleFleetGroup("/FleetGroup", body, {
        method: "put",
        onSuccess: () => {
          addToast("Grupo de frota atualizado com sucesso!");
          refreshList();
          setHash("");
        },
        onError: () => {
          addToast("Erro ao atualizar grupo de frota.", { type: "error" });
          console.error(errorFleetGroup);
        },
      });
      return;
    }
  };

  useLayoutEffect(() => {
    if (isToAddFleetGroup) {
      methods.reset();
    }
  }, [methods.reset, isToAddFleetGroup]);

  return {
    isToAddFleetGroup,
    fleetGroupId,
    methods,
    fleetGroup,
    isLoading,
    handleSubmit: methods.handleSubmit(handleSubmit),
  };
};
