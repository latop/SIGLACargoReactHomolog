"use client";

import { useActivityTruck } from "@/features/ActivityTruck/useActivityTruck";
import { useFetch } from "@/hooks/useFetch";
import { useHash } from "@/hooks/useHash";
import { useToast } from "@/hooks/useToast";
import { ActivityTruck } from "@/interfaces/parameters";
import { fetchActivityTruckById } from "@/services/parameters";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLayoutEffect } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import { z } from "zod";

export const activityTruckSchema = z.object({
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
  flgDriverRequired: z.boolean(),
  color: z.string().min(1, {
    message: "Cor é obrigatória",
  }),
});

export type ActivityTruckFormType = z.infer<typeof activityTruckSchema>;

export const useActivityTruckDialog = () => {
  const { refreshList } = useActivityTruck();
  const methods = useForm<ActivityTruckFormType>({
    resolver: zodResolver(activityTruckSchema),
    defaultValues: {
      code: "",
      description: "",
      flgDriverRequired: false,
      color: "044392",
    },
  });
  const { addToast } = useToast();
  const [handleActivityTruck, { error: errorActivityTruck }] = useFetch();

  const [hash, setHash] = useHash();

  const isToAddActivityTruck = !!(hash as string)?.match(
    /#add-activity-truck/,
  )?.[0];
  const activityTruckId = (hash as string)?.match(
    /#activity-truck-id-(.+)/,
  )?.[1];

  const {
    data: activityTruck,
    error,
    isLoading,
  } = useSWR<ActivityTruck>(
    activityTruckId
      ? { url: `activity-truck-${activityTruckId}`, id: activityTruckId }
      : null,
    fetchActivityTruckById,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      onSuccess: (data) => {
        if (activityTruckId) {
          methods.reset({
            code: data.code,
            description: data.description,
            flgDriverRequired: data.flgDriverRequired,
            color: data.color,
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

  const handleSubmit = async (data: ActivityTruckFormType) => {
    if (isToAddActivityTruck) {
      const body = {
        ...data,
      };
      await handleActivityTruck("/ActivityTruck", body, {
        method: "post",
        onSuccess: () => {
          addToast("Atividade de caminhão adicionada com sucesso!");
          refreshList();
          setHash("");
        },
        onError: () => {
          addToast("Erro ao adicionar atividade de caminhão.", {
            type: "error",
          });
          console.error(errorActivityTruck);
        },
      });
      return;
    }
    if (activityTruckId) {
      const body = {
        ...data,
        id: activityTruck?.id,
      };

      await handleActivityTruck("/ActivityTruck", body, {
        method: "put",
        onSuccess: () => {
          addToast("Atividade de caminhão atualizada com sucesso!");
          refreshList();
          setHash("");
        },
        onError: () => {
          addToast("Erro ao atualizar atividade de caminhão.", {
            type: "error",
          });
          console.error(errorActivityTruck);
        },
      });
      return;
    }
  };

  useLayoutEffect(() => {
    if (isToAddActivityTruck) {
      methods.reset();
    }
  }, [methods.reset, isToAddActivityTruck]);

  return {
    isToAddActivityTruck,
    activityTruckId,
    methods,
    activityTruck,
    isLoading,
    handleSubmit: methods.handleSubmit(handleSubmit),
  };
};
