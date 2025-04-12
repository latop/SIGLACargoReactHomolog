"use client";

import { useFleetType } from "@/features/FleetType/useFleetType";
import { useFetch } from "@/hooks/useFetch";
import { useHash } from "@/hooks/useHash";
import { useToast } from "@/hooks/useToast";
import { FleetType } from "@/interfaces/vehicle";
import { fetchFleetTypeById } from "@/services/vehicles";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLayoutEffect } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import { z } from "zod";

export const fleetTypeSchema = z.object({
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
  standardUnit: z.string().min(1, {
    message: "Obrigatório",
  }),
  tare: z.number().min(0, {
    message: "Tara deve ser maior ou igual a 0",
  }),
  capacity: z.number().min(0, {
    message: "Capacidade deve ser maior ou igual a 0",
  }),
  fuelType: z.string().min(1, {
    message: "Obrigatório",
  }),
  steeringGearType: z.string().min(1, {
    message: "Obrigatório",
  }),
  note: z.string().nullable(),
  fleetGroupId: z.string(),
  companyId: z.string(),
  fleetGroup: z.object({
    code: z.string().optional(),
  }),
  company: z.object({
    code: z.string().optional(),
  }),
});

export type FleetTypeFormType = z.infer<typeof fleetTypeSchema>;

export const useFleetTypeDialog = () => {
  const { refreshList } = useFleetType();
  const methods = useForm<FleetTypeFormType>({
    resolver: zodResolver(fleetTypeSchema),
    defaultValues: {
      code: "",
      description: "",
      standardUnit: "",
      tare: 0,
      capacity: 0,
      fuelType: "",
      steeringGearType: "",
      note: null,
      fleetGroupId: "",
      companyId: "",
    },
  });
  const { addToast } = useToast();
  const [handleFleetType, { error: errorFleetType }] = useFetch();

  const [hash, setHash] = useHash();

  const isToAddFleetType = !!(hash as string)?.match(/#add-fleet-type/)?.[0];
  const fleetTypeId = (hash as string)?.match(/#fleet-type-id-(.+)/)?.[1];

  const {
    data: fleetType,
    error,
    isLoading,
  } = useSWR<FleetType>(
    fleetTypeId ? { url: `fleet-type-${fleetTypeId}`, id: fleetTypeId } : null,
    fetchFleetTypeById,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      onSuccess: (data) => {
        console.log({
          fleetGroupCode: data.fleetGroup.code,
          companyCode: data.company.code,
        });
        if (fleetTypeId) {
          methods.reset({
            code: data.code,
            description: data.description,
            standardUnit: data.standardUnit,
            tare: data.tare,
            capacity: data.capacity,
            fuelType: data.fuelType,
            steeringGearType: data.steeringGearType,
            note: data.note,
            fleetGroup: {
              code: data.fleetGroup.code,
            },
            company: {
              code: data.company.code,
            },
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

  const handleSubmit = async (data: FleetTypeFormType) => {
    if (isToAddFleetType) {
      const body = {
        ...data,
        companyCode: undefined,
        fleetGroupCode: undefined,
      };
      await handleFleetType("/FleetType", body, {
        method: "post",
        onSuccess: () => {
          addToast("Tipo de frota adicionado com sucesso!");
          refreshList();
          setHash("");
        },
        onError: () => {
          addToast("Erro ao adicionar tipo de frota.", { type: "error" });
          console.error(errorFleetType);
        },
      });
      return;
    }
    if (fleetTypeId) {
      const body = {
        ...data,
        id: fleetType?.id,
        companyCode: undefined,
        fleetGroupCode: undefined,
      };

      await handleFleetType("/FleetType", body, {
        method: "put",
        onSuccess: () => {
          addToast("Tipo de frota atualizado com sucesso!");
          refreshList();
          setHash("");
        },
        onError: () => {
          addToast("Erro ao atualizar tipo de frota.", { type: "error" });
          console.error(errorFleetType);
        },
      });
      return;
    }
  };

  useLayoutEffect(() => {
    if (isToAddFleetType) {
      methods.reset();
    }
  }, [methods.reset, isToAddFleetType]);

  return {
    isToAddFleetType,
    fleetTypeId,
    methods,
    fleetType,
    isLoading,
    handleSubmit: methods.handleSubmit(handleSubmit),
  };
};
