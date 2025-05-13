"use client";

import { useTimezone } from "@/features/Timezone/useTimezone";
import { useFetch } from "@/hooks/useFetch";
import { useHash } from "@/hooks/useHash";
import { useToast } from "@/hooks/useToast";
import { Timezone } from "@/services/query/parameters";
import { fetchTimezoneById } from "@/services/parameters";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLayoutEffect } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import { z } from "zod";

export const timezoneSchema = z.object({
  code: z
    .string()
    .min(1, {
      message: "Obrigatório",
    })
    .max(20, {
      message: "Máximo 20 caracteres",
    }),
  description: z
    .string()
    .min(1, {
      message: "Obrigatório",
    })
    .max(100, {
      message: "Máximo 100 caracteres",
    }),
});

export type TimezoneFormType = z.infer<typeof timezoneSchema>;

export const useTimezoneDialog = () => {
  const { refreshList } = useTimezone();
  const methods = useForm<TimezoneFormType>({
    resolver: zodResolver(timezoneSchema),
    defaultValues: {
      code: "",
      description: "",
    },
  });
  const { addToast } = useToast();
  const [handleTimezone, { error: errorTimezone }] = useFetch();

  const [hash, setHash] = useHash();

  const isToAddTimezone = !!(hash as string)?.match(/#add-timezone/)?.[0];
  const timezoneId = (hash as string)?.match(/#timezone-id-(.+)/)?.[1];

  const {
    data: timezone,
    error,
    isLoading,
  } = useSWR<Timezone>(
    timezoneId ? { url: `timezone-${timezoneId}`, id: timezoneId } : null,
    fetchTimezoneById,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      onSuccess: (data) => {
        if (timezoneId) {
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

  const handleSubmit = async (data: TimezoneFormType) => {
    if (isToAddTimezone) {
      const body = {
        ...data,
      };
      await handleTimezone("/Timezone", body, {
        method: "post",
        onSuccess: () => {
          addToast("Fuso horário adicionado com sucesso!");
          refreshList();
          setHash("");
        },
        onError: () => {
          addToast("Erro ao adicionar fuso horário.", { type: "error" });
          console.error(errorTimezone);
        },
      });
      return;
    }
    if (timezoneId) {
      const body = {
        ...data,
        id: timezone?.id,
      };

      await handleTimezone("/Timezone", body, {
        method: "put",
        onSuccess: () => {
          addToast("Fuso horário atualizado com sucesso!");
          refreshList();
          setHash("");
        },
        onError: () => {
          addToast("Erro ao atualizar fuso horário.", { type: "error" });
          console.error(errorTimezone);
        },
      });
      return;
    }
  };

  useLayoutEffect(() => {
    if (isToAddTimezone) {
      methods.reset();
    }
  }, [methods.reset, isToAddTimezone]);
  return {
    isToAddTimezone,
    timezoneId,
    methods,
    timezone,
    isLoading,
    handleSubmit: methods.handleSubmit(handleSubmit),
  };
};
