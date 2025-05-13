/* eslint-disable prettier/prettier */
"use client";

import { useAttribution } from "@/features/Attribuition/useAttibution";
import { useFetch } from "@/hooks/useFetch";
import { useHash } from "@/hooks/useHash";
import { useToast } from "@/hooks/useToast";
import { Attribution } from "@/interfaces/parameters";
import { fetchAttribuitionById } from "@/services/parameters";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLayoutEffect } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import { z } from "zod";

export const attributionSchema = z.object({
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

export type AttributionFormType = z.infer<typeof attributionSchema>;

export const useAttributionDialog = () => {
  const { refreshList } = useAttribution();
  const methods = useForm<AttributionFormType>({
    resolver: zodResolver(attributionSchema),
    defaultValues: {
      code: "",
      description: "",
    },
  });
  const { addToast } = useToast();
  const [handleAttribution, { error: errorResponsibleSector }] =
    useFetch();

  const [hash, setHash] = useHash();

  const isToAddAttributtion = !!(hash as string)?.match(
    /#add-attribution/,
  )?.[0];
  const attributionId = (hash as string)?.match(
    /#attribution-id-(.+)/,
  )?.[1];

  const {
    data: attribution,
    error,
    isLoading,
  } = useSWR<Attribution>(
    attributionId
      ? {
        url: `attribution-${attributionId}`,
        id: attributionId,
      }
      : null,
    fetchAttribuitionById,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      onSuccess: (data) => {
        if (attributionId) {
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

  const handleSubmit = async (data: AttributionFormType) => {
    if (isToAddAttributtion) {
      const body = {
        ...data,
      };
      await handleAttribution("/Attribution", body, {
        method: "post",
        onSuccess: () => {
          addToast("Setor responsável adicionado com sucesso!");
          refreshList();
          setHash("");
        },
        onError: () => {
          addToast("Erro ao adicionar setor responsável.", { type: "error" });
          console.error(errorResponsibleSector);
        },
      });
      return;
    }
    if (attributionId) {
      const body = {
        ...data,
        id: attribution?.id,
      };

      await handleAttribution("/Attribution", body, {
        method: "put",
        onSuccess: () => {
          addToast("Setor responsável atualizado com sucesso!");
          refreshList();
          setHash("");
        },
        onError: () => {
          addToast("Erro ao atualizar setor responsável.", { type: "error" });
          console.error(errorResponsibleSector);
        },
      });
      return;
    }
  };

  useLayoutEffect(() => {
    if (isToAddAttributtion) {
      methods.reset();
    }
  }, [methods.reset, isToAddAttributtion]);

  return {
    isToAddAttributtion,
    attributionId,
    methods,
    attribution,
    isLoading,
    handleSubmit: methods.handleSubmit(handleSubmit),
  };
};
