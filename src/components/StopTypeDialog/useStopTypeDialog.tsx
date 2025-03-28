/* eslint-disable prettier/prettier */
"use client";

import { useStopType } from "@/features/StopType/useStopType";
import { useFetch } from "@/hooks/useFetch";
import { useHash } from "@/hooks/useHash";
import { useToast } from "@/hooks/useToast";
import { StopType } from "@/interfaces/trip";
import { fetchStopTypeById } from "@/services/trips";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLayoutEffect } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import { z } from "zod";

export const stopTypeSchema = z.object({
  stopTypeCode: z
    .string()
    .min(1, {
      message: "Obrigatório",
    })
    .max(10, {
      message: "Máximo 10 caracteres.",
    }),
  stopTime: z.coerce.number().min(1, {
    message: "Obrigatório",
  }),
  flgJourney: z.enum(["S", "N"]).optional().default("N"),
});

export type StopTypeFormType = z.infer<typeof stopTypeSchema>;

export const useStopTypeDialog = () => {
  const { refreshList } = useStopType();
  const methods = useForm<StopTypeFormType>({
    resolver: zodResolver(stopTypeSchema),
    defaultValues: {
      stopTypeCode: "",
      stopTime: 0,
      flgJourney: "N",
    },
  });
  const { addToast } = useToast();
  const [handleStopType, { error: errorLocationType }] =
    useFetch();

  const [hash, setHash] = useHash();

  const isToAddStopType = !!(hash as string)?.match(
    /#add-stop-type/,
  )?.[0];
  const stopTypeId = (hash as string)?.match(
    /#stop-type-id-(.+)/,
  )?.[1];

  const {
    data: stopType,
    error,
    isLoading,
  } = useSWR<StopType>(
    stopTypeId
      ? {
        url: `stop-type-${stopTypeId}`,
        id: stopTypeId,
      }
      : null,
    fetchStopTypeById,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      onSuccess: (data) => {
        if (stopTypeId) {
          methods.reset({
            stopTypeCode: data.stopTypeCode,
            stopTime: data.stopTime,
            flgJourney: data.flgJourney === "S" ? "S" : "N" as "S" | "N",
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

  const handleSubmit = async (data: StopTypeFormType) => {
    if (isToAddStopType) {
      const body = {
        ...data,
      };
      await handleStopType("/StopType", body, {
        method: "post",
        onSuccess: () => {
          addToast("Tipo de Parada adicionado com sucesso!");
          refreshList();
          setHash("");
        },
        onError: () => {
          addToast("Erro ao adicionar Tipo de Parada.", { type: "error" });
          console.error(errorLocationType);
        },
      });
      return;
    }
    if (stopTypeId) {
      const body = {
        ...data,
        id: stopType?.id,
      };

      await handleStopType("/StopType", body, {
        method: "put",
        onSuccess: () => {
          addToast("Tipo de Parada atualizado com sucesso!");
          refreshList();
          setHash("");
        },
        onError: () => {
          addToast("Erro ao atualizar Tipo de Parada.", { type: "error" });
          console.error(errorLocationType);
        },
      });
      return;
    }
  };

  useLayoutEffect(() => {
    if (isToAddStopType) {
      methods.reset();
    }
  }, [methods.reset, isToAddStopType]);

  return {
    isToAddStopType,
    stopTypeId,
    methods,
    stopType,
    isLoading,
    handleSubmit: methods.handleSubmit(handleSubmit),
  };
};
