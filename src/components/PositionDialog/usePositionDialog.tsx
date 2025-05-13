"use client";

import { usePosition } from "@/features/Position/usePosition";
import { useFetch } from "@/hooks/useFetch";
import { useHash } from "@/hooks/useHash";
import { useToast } from "@/hooks/useToast";
import { Position } from "@/interfaces/parameters";
import { fetchPositionById } from "@/services/parameters";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLayoutEffect } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import { z } from "zod";

export const positionSchema = z.object({
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
  priority: z.number().min(0, {
    message: "Prioridade deve ser maior ou igual a 0",
  }),
  colorRGB: z.number().min(0, {
    message: "Cor é obrigatória",
  }),
});

export type PositionFormType = z.infer<typeof positionSchema>;

export const usePositionDialog = () => {
  const { refreshList } = usePosition();
  const methods = useForm<PositionFormType>({
    resolver: zodResolver(positionSchema),
    defaultValues: {
      code: "",
      description: "",
      priority: 0,
      colorRGB: 0,
    },
  });
  const { addToast } = useToast();
  const [handlePosition, { error: errorPosition }] = useFetch();

  const [hash, setHash] = useHash();

  const isToAddPosition = !!(hash as string)?.match(/#add-position/)?.[0];
  const positionId = (hash as string)?.match(/#position-id-(.+)/)?.[1];

  const {
    data: position,
    error,
    isLoading,
  } = useSWR<Position>(
    positionId ? { url: `position-${positionId}`, id: positionId } : null,
    fetchPositionById,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      onSuccess: (data) => {
        if (positionId) {
          methods.reset({
            code: data.code,
            description: data.description,
            priority: data.priority,
            colorRGB: data.colorRGB,
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

  const handleSubmit = async (data: PositionFormType) => {
    if (isToAddPosition) {
      const body = {
        ...data,
      };
      await handlePosition("/Position", body, {
        method: "post",
        onSuccess: () => {
          addToast("Cargo adicionado com sucesso!");
          refreshList();
          setHash("");
        },
        onError: () => {
          addToast("Erro ao adicionar posição.", { type: "error" });
          console.error(errorPosition);
        },
      });
      return;
    }
    if (positionId) {
      const body = {
        ...data,
        id: position?.id,
      };

      await handlePosition("/Position", body, {
        method: "put",
        onSuccess: () => {
          addToast("Cargo atualizado com sucesso!");
          refreshList();
          setHash("");
        },
        onError: () => {
          addToast("Erro ao atualizar cargo.", { type: "error" });
          console.error(errorPosition);
        },
      });
      return;
    }
  };

  useLayoutEffect(() => {
    if (isToAddPosition) {
      methods.reset();
    }
  }, [methods.reset, isToAddPosition]);

  return {
    isToAddPosition,
    positionId,
    methods,
    position,
    isLoading,
    handleSubmit: methods.handleSubmit(handleSubmit),
  };
};
