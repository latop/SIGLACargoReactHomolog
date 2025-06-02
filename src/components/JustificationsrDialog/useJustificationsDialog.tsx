/* eslint-disable prettier/prettier */
"use client";

import { useJustifications } from "@/features/Justifications/useJustifications";
import { useFetch } from "@/hooks/useFetch";
import { useHash } from "@/hooks/useHash";
import { useToast } from "@/hooks/useToast";
import { fetchJustificationById } from "@/services/parameters";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLayoutEffect } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import { z } from "zod";

const justificationSchema = z.object({
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
    .max(100, {
      message: "Máximo 100 caracteres.",
    }),
  responsibleSectorId: z.string().min(1, {
    message: "Obrigatório",
  }),
  responsibleSector: z.object({
    description: z.string().min(1, { message: "Obrigatório" }),
  }),
  type: z.enum(["A", "C"], { errorMap: () => ({ message: "Obrigatório" }) }),
});

type JustificationsFormType = z.infer<typeof justificationSchema>;

export const useJustificationsDialog = () => {
  const { refreshList } = useJustifications();
  const methods = useForm<JustificationsFormType>({
    resolver: zodResolver(justificationSchema),
    defaultValues: {
      code: "",
      description: "",
      responsibleSectorId: "",
      type: undefined,
    },
  });
  const { addToast } = useToast();
  const [handleJustification, { error: errorJustification }] = useFetch();

  const [hash, setHash] = useHash();

  const isToAddJustification = !!(hash as string)?.match(
    /#add-justifications/,
  )?.[0];
  const justificationId = (hash as string)?.match(
    /#justification-id-(.+)/,
  )?.[1];

  const {
    data: justification,
    error,
    isLoading,
  } = useSWR<JustificationsFormType>(
    justificationId
      ? {
          url: `justification`,
          id: justificationId,
        }
      : null,
    fetchJustificationById,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      onSuccess: (data) => {
        if (isToAddJustification) {
          methods.reset({});
          return;
        }

        methods.reset({
          code: data.code,
          description: data.description,
          type: data.type,
          responsibleSector: data?.responsibleSector,
          responsibleSectorId: data?.responsibleSectorId,
        });
      },
      onError: () => {
        console.error(error);
      },
    },
  );

  const handleSubmit = async (data: JustificationsFormType) => {
    if (isToAddJustification) {
      const body = {
        description: data?.description,
        code: data?.code,
        type: data?.type,
        id: justificationId,
        responsibleSectorId: data?.responsibleSectorId,
      };
      await handleJustification("/Justification", body, {
        method: "post",
        onSuccess: () => {
          addToast("Justificativa adicionada com sucesso!");
          refreshList();
          setHash("");
        },
        onError: () => {
          addToast("Erro ao adicionar justificativa.", { type: "error" });
          console.error(errorJustification);
        },
      });
      return;
    }
    if (justificationId) {
      const body = {
        description: data?.description,
        code: data?.code,
        type: data?.type,
        id: justificationId,
        responsibleSectorId: data?.responsibleSectorId,
      };

      await handleJustification("/Justification", body, {
        method: "put",
        onSuccess: () => {
          addToast("Justificativa atualizada com sucesso!");
          refreshList();
          setHash("");
        },
        onError: () => {
          addToast("Erro ao atualizar Justificativa.", { type: "error" });
          console.error(errorJustification);
        },
      });
      return;
    }
  };

  useLayoutEffect(() => {
    if (isToAddJustification) {
      methods.reset({});
    }
  }, [methods.reset, isToAddJustification]);

  return {
    isToAddJustification,
    justificationId,
    methods,
    justification,
    isLoading,
    handleSubmit: methods.handleSubmit(handleSubmit),
  };
};
