/* eslint-disable prettier/prettier */
"use client";

import { useLocationType } from "@/features/LocationType/useLocationType";
import { useFetch } from "@/hooks/useFetch";
import { useHash } from "@/hooks/useHash";
import { useToast } from "@/hooks/useToast";
import { LocationType } from "@/interfaces/trip";
import { fetchLocationTypeById } from "@/services/trips";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLayoutEffect } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import { z } from "zod";

export const locationTypeSchema = z.object({
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
  isOperation: z.boolean().default(false),
});

export type LocationTypeFormType = z.infer<typeof locationTypeSchema>;

export const useLocationTypeDialog = () => {
  const { refreshList } = useLocationType();
  const methods = useForm<LocationTypeFormType>({
    resolver: zodResolver(locationTypeSchema),
    defaultValues: {
      code: "",
      description: "",
      isOperation: false,
    },
  });
  const { addToast } = useToast();
  const [handleLocationType, { error: errorLocationType }] =
    useFetch();

  const [hash, setHash] = useHash();

  const isToAddLocationType = !!(hash as string)?.match(
    /#add-location-type/,
  )?.[0];
  const locationTypeId = (hash as string)?.match(
    /#location-type-id-(.+)/,
  )?.[1];

  const {
    data: locationType,
    error,
    isLoading,
  } = useSWR<LocationType>(
    locationTypeId
      ? {
        url: `location-type-${locationTypeId}`,
        id: locationTypeId,
      }
      : null,
    fetchLocationTypeById,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      onSuccess: (data) => {
        if (locationTypeId) {
          methods.reset({
            code: data.code,
            description: data.description,
            isOperation: data.isOperation,
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

  const handleSubmit = async (data: LocationTypeFormType) => {
    if (isToAddLocationType) {
      const body = {
        ...data,
      };
      await handleLocationType("/LocationType", body, {
        method: "post",
        onSuccess: () => {
          addToast("Tipo de Localização adicionado com sucesso!");
          refreshList();
          setHash("");
        },
        onError: () => {
          addToast("Erro ao adicionar Tipo de Localização.", { type: "error" });
          console.error(errorLocationType);
        },
      });
      return;
    }
    if (locationTypeId) {
      const body = {
        ...data,
        id: locationType?.id,
      };

      await handleLocationType("/LocationType", body, {
        method: "put",
        onSuccess: () => {
          addToast("Tipo de Localização atualizado com sucesso!");
          refreshList();
          setHash("");
        },
        onError: () => {
          addToast("Erro ao atualizar Tipo de Localização .", { type: "error" });
          console.error(errorLocationType);
        },
      });
      return;
    }
  };

  useLayoutEffect(() => {
    if (isToAddLocationType) {
      methods.reset();
    }
  }, [methods.reset, isToAddLocationType]);

  return {
    isToAddLocationGroup: isToAddLocationType,
    locationGroupId: locationTypeId,
    methods,
    locationGroup: locationType,
    isLoading,
    handleSubmit: methods.handleSubmit(handleSubmit),
  };
};
