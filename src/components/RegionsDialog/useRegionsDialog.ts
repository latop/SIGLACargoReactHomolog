"use client";

import { useRegions } from "@/features/Regions/useRegions";
import { useFetch } from "@/hooks/useFetch";
import { useHash } from "@/hooks/useHash";
import { useToast } from "@/hooks/useToast";
import { Region } from "@/interfaces/parameters";
import { fetchRegionById } from "@/services/parameters";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLayoutEffect } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import { z } from "zod";

export const regionSchema = z.object({
  code: z
    .string()
    .min(1, {
      message: "Obrigatório",
    })
    .max(2, {
      message: "Máximo 2 caracteres.",
    }),
  name: z.string().min(1, {
    message: "Obrigatório",
  }),
});

export type RegionFormType = z.infer<typeof regionSchema>;

export const useRegionsDialog = () => {
  const { refreshList } = useRegions();
  const methods = useForm<RegionFormType>({
    resolver: zodResolver(regionSchema),
    defaultValues: {
      code: "",
      name: "",
    },
  });
  const { addToast } = useToast();
  const [handleRegion, { error: errorRegion }] = useFetch();

  const [hash, setHash] = useHash();

  const isToAddRegion = !!(hash as string)?.match(/#add-region/)?.[0];
  const regionId = (hash as string)?.match(/#region-id-(.+)/)?.[1];

  const {
    data: region,
    error,
    isLoading,
  } = useSWR<Region>(
    regionId ? { url: `region-${regionId}`, id: regionId } : null,
    fetchRegionById,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      onSuccess: (data) => {
        if (regionId) {
          methods.reset({
            code: data.code,
            name: data.name,
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

  const handleSubmit = async (data: RegionFormType) => {
    if (isToAddRegion) {
      const body = {
        ...data,
      };
      await handleRegion("/Regions", body, {
        method: "post",
        onSuccess: () => {
          addToast("Região adicionada com sucesso!");
          refreshList();
          setHash("");
        },
        onError: () => {
          addToast("Erro ao adicionar região.", { type: "error" });
          console.error(errorRegion);
        },
      });
      return;
    }
    if (regionId) {
      const body = {
        ...data,
        id: region?.id,
      };

      await handleRegion("/Regions", body, {
        method: "put",
        onSuccess: () => {
          addToast("Região atualizada com sucesso!");
          refreshList();
          setHash("");
        },
        onError: () => {
          addToast("Erro ao atualizar região.", { type: "error" });
          console.error(errorRegion);
        },
      });
      return;
    }
  };

  useLayoutEffect(() => {
    if (isToAddRegion) {
      methods.reset();
    }
  }, [methods.reset, isToAddRegion]);

  return {
    isToAddRegion,
    regionId,
    methods,
    region,
    isLoading,
    handleSubmit: methods.handleSubmit(handleSubmit),
  };
};
