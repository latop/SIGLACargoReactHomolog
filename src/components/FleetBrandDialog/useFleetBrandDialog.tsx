"use client";

import { useFleetBrand } from "@/features/FleetBrand/useFleetBrand";
import { useFetch } from "@/hooks/useFetch";
import { useHash } from "@/hooks/useHash";
import { useToast } from "@/hooks/useToast";
import { FleetBrand } from "@/interfaces/vehicle";
import { fetchFleetBrandById } from "@/services/vehicles";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLayoutEffect } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import { z } from "zod";

export const fleetBrandSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Obrigatório",
    })
    .max(50, {
      message: "Máximo 50 caracteres.",
    }),
  code: z
    .string()
    .min(1, {
      message: "Obrigatório",
    })
    .max(10, {
      message: "Máximo 10 caracteres.",
    }),
});

export type FleetBrandFormType = z.infer<typeof fleetBrandSchema>;

export const useFleetBrandDialog = () => {
  const { refreshList } = useFleetBrand();
  const methods = useForm<FleetBrandFormType>({
    resolver: zodResolver(fleetBrandSchema),
    defaultValues: {
      name: "",
      code: "",
    },
  });
  const { addToast } = useToast();
  const [handleFleetBrand, { error: errorFleetBrand }] = useFetch();

  const [hash, setHash] = useHash();

  const isToAddFleetBrand = !!(hash as string)?.match(/#add-fleet-brand/)?.[0];
  const fleetBrandId = (hash as string)?.match(/#fleet-brand-id-(.+)/)?.[1];

  const {
    data: fleetBrand,
    error,
    isLoading,
  } = useSWR<FleetBrand>(
    fleetBrandId
      ? { url: `fleet-brand-${fleetBrandId}`, id: fleetBrandId }
      : null,
    fetchFleetBrandById,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      onSuccess: (data) => {
        if (fleetBrandId) {
          methods.reset({
            name: data.name,
            code: data.code,
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

  const handleSubmit = async (data: FleetBrandFormType) => {
    if (isToAddFleetBrand) {
      await handleFleetBrand("/FleetBrand", data, {
        method: "post",
        onSuccess: () => {
          addToast("Marca de frota adicionada com sucesso!");
          refreshList();
          setHash("");
        },
        onError: () => {
          addToast("Erro ao adicionar marca de frota.", { type: "error" });
          console.error(errorFleetBrand);
        },
      });
      return;
    }
    if (fleetBrandId) {
      const body = {
        ...data,
        id: fleetBrand?.id,
      };

      await handleFleetBrand("/FleetBrand", body, {
        method: "put",
        onSuccess: () => {
          addToast("Marca de frota atualizada com sucesso!");
          refreshList();
          setHash("");
        },
        onError: () => {
          addToast("Erro ao atualizar marca de frota.", { type: "error" });
          console.error(errorFleetBrand);
        },
      });
      return;
    }
  };

  useLayoutEffect(() => {
    if (isToAddFleetBrand) {
      methods.reset();
    }
  }, [methods.reset, isToAddFleetBrand]);
  return {
    isToAddFleetBrand,
    fleetBrandId,
    methods,
    fleetBrand,
    isLoading,
    handleSubmit: methods.handleSubmit(handleSubmit),
  };
};
