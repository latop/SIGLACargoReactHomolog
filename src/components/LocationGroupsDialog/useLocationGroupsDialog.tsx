/* eslint-disable prettier/prettier */
"use client";

import { useLocationGroup } from "@/features/LocationGroup/useLocationGroup";
import { useFetch } from "@/hooks/useFetch";
import { useHash } from "@/hooks/useHash";
import { useToast } from "@/hooks/useToast";
import { LocationGroup } from "@/interfaces/trip";
import { fetchLocationGroupById } from "@/services/trips";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLayoutEffect } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import { z } from "zod";

export const locationGroupsSchema = z.object({
  code: z
    .string()
    .min(1, {
      message: "Obrigatório",
    })
    .max(10, {
      message: "Máximo 10 caracteres.",
    }),
  description: z.string().min(1, {
    message: "Obrigatório",
  }),
});

export type LocationGroupsFormType = z.infer<typeof locationGroupsSchema>;

export const useLocationGroupsDialog = () => {
  const { refreshList } = useLocationGroup();
  const methods = useForm<LocationGroupsFormType>({
    resolver: zodResolver(locationGroupsSchema),
    defaultValues: {
      code: "",
      description: "",
    },
  });
  const { addToast } = useToast();
  const [handleResponsibleSector, { error: errorLocationGroup }] =
    useFetch();

  const [hash, setHash] = useHash();

  const isToAddLocationGroup = !!(hash as string)?.match(
    /#add-location-group/,
  )?.[0];
  const locationGroupId = (hash as string)?.match(
    /#location-group-id-(.+)/,
  )?.[1];

  const {
    data: locationGroup,
    error,
    isLoading,
  } = useSWR<LocationGroup>(
    locationGroupId
      ? {
        url: `location-group-${locationGroupId}`,
        id: locationGroupId,
      }
      : null,
    fetchLocationGroupById,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      onSuccess: (data) => {
        if (locationGroupId) {
          methods.reset({
            code: data.code,
            description: data.description,
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

  const handleSubmit = async (data: LocationGroupsFormType) => {
    if (isToAddLocationGroup) {
      const body = {
        ...data,
      };
      await handleResponsibleSector("/LocationGroup", body, {
        method: "post",
        onSuccess: () => {
          addToast("Grupo de Localização adicionado com sucesso!");
          refreshList();
          setHash("");
        },
        onError: () => {
          addToast("Erro ao adicionar Grupo de Localização.", { type: "error" });
          console.error(errorLocationGroup);
        },
      });
      return;
    }
    if (locationGroupId) {
      const body = {
        ...data,
        id: locationGroup?.id,
      };

      await handleResponsibleSector("/LocationGroup", body, {
        method: "put",
        onSuccess: () => {
          addToast("Grupo de Localização atualizado com sucesso!");
          refreshList();
          setHash("");
        },
        onError: () => {
          addToast("Erro ao atualizar Grupo de Localização .", { type: "error" });
          console.error(errorLocationGroup);
        },
      });
      return;
    }
  };

  useLayoutEffect(() => {
    if (isToAddLocationGroup) {
      methods.reset();
    }
  }, [methods.reset, isToAddLocationGroup]);

  return {
    isToAddLocationGroup,
    locationGroupId,
    methods,
    locationGroup,
    isLoading,
    handleSubmit: methods.handleSubmit(handleSubmit),
  };
};
