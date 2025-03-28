/* eslint-disable prettier/prettier */
"use client";

import { useActivity } from "@/features/Activity/useActivity";
import { useFetch } from "@/hooks/useFetch";
import { useHash } from "@/hooks/useHash";
import { useToast } from "@/hooks/useToast";
import { Activity } from "@/interfaces/parameters";
import { fetchActivityById } from "@/services/parameters";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { useLayoutEffect } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import { z } from "zod";




export const activitySchema = z.object({
  id: z.string().uuid({
    message: "ID deve ser um UUID válido.",
  }).optional(),
  code: z
    .string()
    .min(1, { message: "Obrigatório" })
    .max(10, { message: "Máximo 10 caracteres." }),
  description: z.string().min(1, { message: "Obrigatório" }),
  activityTypeId: z.string().uuid({ message: "Id inválido para o tipo de atividade" }),
  activityType: z.object({
    code: z.string().optional(),
  }),
  start: z.string(),
  end: z.string(),
  flgActive: z.boolean().default(false),
  flgMeal: z.boolean().default(false),
  flgLunch: z.boolean().default(false),
  flgRest: z.boolean().default(false),
  flgRequest: z.boolean().default(false),
});

export type ActivityFormType = z.infer<typeof activitySchema>;

export const useActivityTypeDialog = () => {
  const { refreshList } = useActivity();
  const methods = useForm<ActivityFormType>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      code: "",
      description: "",
      flgActive: true,
      flgMeal: true,
      flgLunch: true,
      flgRest: true,
      flgRequest: true,
      activityType: {
        code: "",
      },
      activityTypeId: "",
      start: dayjs().format(),
      end: dayjs().add(1, "hour").format(),

    },
  });
  const { addToast } = useToast();
  const [handleActivityType, { error: errorActivityType }] =
    useFetch();

  const [hash, setHash] = useHash();

  const isToAddActivity = !!(hash as string)?.match(
    /#add-activity/,
  )?.[0];
  const activityId = (hash as string)?.match(
    /#activity-id-(.+)/,
  )?.[1];
  const {
    data: activity,
    error,
    isLoading,
  } = useSWR<Activity>(
    activityId
      ? {
        url: `activity-${activityId}`,
        id: activityId,
      }
      : null,
    fetchActivityById,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      onSuccess: (data) => {
        if (activityId) {
          methods.reset(data);
          return;
        }
        methods.reset({});
      },
      onError: () => {
        console.error(error);
      },
    },
  );

  const handleSubmit = async (data: ActivityFormType) => {
    if (isToAddActivity) {
      const body = {
        ...data,
        activityType: undefined,
      };
      await handleActivityType("/Activity", body, {
        method: "post",
        onSuccess: () => {
          addToast("Atividade adicionada com sucesso!");
          refreshList();
          setHash("");
        },
        onError: () => {
          addToast("Erro ao adicionar atividade.", { type: "error" });
          console.error(errorActivityType);
        },
      });
      return;
    }
    if (activityId) {
      const body = {
        ...data,
        id: activity?.id,
        activityType: undefined,
      };

      await handleActivityType("/Activity", body, {
        method: "put",
        onSuccess: () => {
          addToast("Atividade atualizada com sucesso!");
          refreshList();
          setHash("");
        },
        onError: () => {
          addToast("Erro ao atualizar atividade .", { type: "error" });
          console.error(errorActivityType);
        },
      });
      return;
    }
  };

  useLayoutEffect(() => {
    if (isToAddActivity) {
      methods.reset();
    }
  }, [methods.reset, isToAddActivity]);


  return {
    isToAddActivityType: isToAddActivity,
    activityTypeId: activityId,
    methods,
    activityType: activity,
    isLoading,
    handleSubmit: methods.handleSubmit(handleSubmit),
  };
};
