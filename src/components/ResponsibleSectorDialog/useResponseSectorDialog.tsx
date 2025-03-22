/* eslint-disable prettier/prettier */
"use client";

import { useResponsibleSector } from "@/features/ResponsibleSector/useResponsibleSector";
import { useFetch } from "@/hooks/useFetch";
import { useHash } from "@/hooks/useHash";
import { useToast } from "@/hooks/useToast";
import { ResponsibleSectorType } from "@/interfaces/parameters";
import { fetchResponsibleSectorById } from "@/services/parameters";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLayoutEffect } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import { z } from "zod";

export const resposibleSectorSchema = z.object({
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

export type ResponsibleSectorFormType = z.infer<typeof resposibleSectorSchema>;

export const useResponsibleSectorDialog = () => {
  const { refreshList } = useResponsibleSector();
  const methods = useForm<ResponsibleSectorFormType>({
    resolver: zodResolver(resposibleSectorSchema),
    defaultValues: {
      code: "",
      description: "",
    },
  });
  const { addToast } = useToast();
  const [handleResponsibleSector, { error: errorResponsibleSector }] =
    useFetch();

  const [hash, setHash] = useHash();

  const isToAddResponsibleSector = !!(hash as string)?.match(
    /#add-responsible-sector/,
  )?.[0];
  const responsibleSectorId = (hash as string)?.match(
    /#responsible-sector-id-(.+)/,
  )?.[1];

  const {
    data: responsibleSector,
    error,
    isLoading,
  } = useSWR<ResponsibleSectorType>(
    responsibleSectorId
      ? {
        url: `responsible-sector-${responsibleSectorId}`,
        id: responsibleSectorId,
      }
      : null,
    fetchResponsibleSectorById,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      onSuccess: (data) => {
        if (responsibleSectorId) {
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

  const handleSubmit = async (data: ResponsibleSectorFormType) => {
    if (isToAddResponsibleSector) {
      const body = {
        ...data,
      };
      await handleResponsibleSector("/ResponsibleSector", body, {
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
    if (responsibleSectorId) {
      const body = {
        ...data,
        id: responsibleSector?.id,
      };

      await handleResponsibleSector("/ResponsibleSector", body, {
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
    if (isToAddResponsibleSector) {
      methods.reset();
    }
  }, [methods.reset, isToAddResponsibleSector]);

  return {
    isToAddResponsibleSector,
    responsibleSectorId,
    methods,
    responsibleSector,
    isLoading,
    handleSubmit: methods.handleSubmit(handleSubmit),
  };
};
