/* eslint-disable prettier/prettier */
"use client";

import { useActivityType } from "@/features/ActivityType/useActivityType";
import { useFetch } from "@/hooks/useFetch";
import { useHash } from "@/hooks/useHash";
import { useToast } from "@/hooks/useToast";
import { ActivityType } from "@/interfaces/parameters";
import { fetchActivityTypeById } from "@/services/parameters";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLayoutEffect } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import { z } from "zod";


export const activityTypeSchema = z.object({
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
  function: z.string().min(1, {
    message: "Obrigatório",
  }),
  flgJourney: z.boolean(),
  flgPayroll: z.boolean(),
  color: z.string().min(1, {
    message: "Obrigatório",
  }),
  id: z.string().uuid({
    message: "ID deve ser um UUID válido.",
  }).optional(),
});


export type ActivityTypeFormType = z.infer<typeof activityTypeSchema>;

export const useActivityTypeDialog = () => {
  const { refreshList } = useActivityType();
  const methods = useForm<ActivityTypeFormType>({
    resolver: zodResolver(activityTypeSchema),
    defaultValues: {
      code: "",
      description: "",
      color: "#000",
      flgJourney: false,
      flgPayroll: false,
      function: "",
    },
  });
  const { addToast } = useToast();
  const [handleActivityType, { error: errorActivityType }] =
    useFetch();

  const [hash, setHash] = useHash();

  const isToAddActivityType = !!(hash as string)?.match(
    /#add-activity-type/,
  )?.[0];
  const activityTypeId = (hash as string)?.match(
    /#activity-type-id-(.+)/,
  )?.[1];
  const {
    data: activityType,
    error,
    isLoading,
  } = useSWR<ActivityType>(
    activityTypeId
      ? {
        url: `activity-type-${activityTypeId}`,
        id: activityTypeId,
      }
      : null,
    fetchActivityTypeById,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      onSuccess: (data) => {
        if (activityTypeId) {
          methods.reset({
            ...data,
            color: `#${data.color}`,
          } as ActivityType);
          return;
        }
        methods.reset({});
      },
      onError: () => {
        console.error(error);
      },
    },
  );

  const handleSubmit = async (data: ActivityTypeFormType) => {
    if (isToAddActivityType) {
      const body = {
        ...data,
      };
      await handleActivityType("/ActivityType", body, {
        method: "post",
        onSuccess: () => {
          addToast("Tipo de atividade adicionado com sucesso!");
          refreshList();
          setHash("");
        },
        onError: () => {
          addToast("Erro ao adicionar Tipo de atividade.", { type: "error" });
          console.error(errorActivityType);
        },
      });
      return;
    }
    if (activityTypeId) {
      const body = {
        ...data,
        id: activityType?.id,
      };

      await handleActivityType("/ActivityType", body, {
        method: "put",
        onSuccess: () => {
          addToast("Tipo de atividade atualizado com sucesso!");
          refreshList();
          setHash("");
        },
        onError: () => {
          addToast("Erro ao atualizar Tipo de atividade .", { type: "error" });
          console.error(errorActivityType);
        },
      });
      return;
    }
  };

  useLayoutEffect(() => {
    if (isToAddActivityType) {
      methods.reset();
    }
  }, [methods.reset, isToAddActivityType]);

  return {
    isToAddActivityType,
    activityTypeId,
    methods,
    activityType,
    isLoading,
    handleSubmit: methods.handleSubmit(handleSubmit),
  };
};
