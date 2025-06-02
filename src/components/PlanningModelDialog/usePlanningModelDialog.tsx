"use client";

import { usePlanningModel } from "@/features/PlanningModel/usePlanningModel";
import { useFetch } from "@/hooks/useFetch";
import { useHash } from "@/hooks/useHash";
import { useToast } from "@/hooks/useToast";
import { PlanningModel } from "@/interfaces/planning";
import { fetchPlanningModelById } from "@/services/planning";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLayoutEffect } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import { z } from "zod";

export const planningModelSchema = z.object({
  startDate: z.string().min(1, {
    message: "Obrigatório",
  }),
  endDate: z.string().min(1, {
    message: "Obrigatório",
  }),
  locationOrigId: z.string().min(1, {
    message: "Obrigatório",
  }),
  locationDestId: z.string().min(1, {
    message: "Obrigatório",
  }),
  locationOrig: z
    .object({
      id: z.string().min(1, {
        message: "Obrigatório",
      }),
      code: z.string().optional(),
    })
    .optional(),
  locationDest: z
    .object({
      id: z.string().min(1, {
        message: "Obrigatório",
      }),
      code: z.string().optional(),
    })
    .optional(),
  freqMon: z.coerce.number().min(0, {
    message: "Mínimo 0",
  }),
  freqTue: z.coerce.number().min(0, {
    message: "Mínimo 0",
  }),
  freqWed: z.coerce.number().min(0, {
    message: "Mínimo 0",
  }),
  freqThu: z.coerce.number().min(0, {
    message: "Mínimo 0",
  }),
  freqFri: z.coerce.number().min(0, {
    message: "Mínimo 0",
  }),
  freqSat: z.coerce.number().min(0, {
    message: "Mínimo 0",
  }),
  freqSun: z.coerce.number().min(0, {
    message: "Mínimo 0",
  }),
});

export type PlanningModelFormType = z.infer<typeof planningModelSchema>;

export const usePlanningModelDialog = () => {
  const { refreshList } = usePlanningModel();
  const methods = useForm<PlanningModelFormType>({
    resolver: zodResolver(planningModelSchema),
    defaultValues: {
      startDate: "",
      endDate: "",
      locationOrigId: "",
      locationDestId: "",
      freqMon: 0,
      freqTue: 0,
      freqWed: 0,
      freqThu: 0,
      freqFri: 0,
      freqSat: 0,
      freqSun: 0,
    },
  });
  const { addToast } = useToast();
  const [handlePlanningModel, { error: errorPlanningModel }] = useFetch();

  const [hash, setHash] = useHash();

  const isToAddPlanningModel = !!(hash as string)?.match(
    /#add-planning-model/,
  )?.[0];
  const planningModelId = (hash as string)?.match(
    /#planning-model-id-(.+)/,
  )?.[1];

  const {
    data: planningModel,
    error,
    isLoading,
  } = useSWR<PlanningModel>(
    planningModelId
      ? {
          url: `planning-model-${planningModelId}`,
          id: planningModelId,
        }
      : null,
    fetchPlanningModelById,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      onSuccess: (data) => {
        if (planningModelId) {
          methods.reset({
            startDate: data.startDate,
            endDate: data.endDate,
            locationOrigId: data.locationOrig?.id,
            locationDestId: data.locationDest?.id,
            locationOrig: data.locationOrig,
            locationDest: data.locationDest,
            freqMon: data.freqMon,
            freqTue: data.freqTue,
            freqWed: data.freqWed,
            freqThu: data.freqThu,
            freqFri: data.freqFri,
            freqSat: data.freqSat,
            freqSun: data.freqSun,
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

  const handleSubmit = async (data: PlanningModelFormType) => {
    if (isToAddPlanningModel) {
      const body = {
        ...data,
        locationOrigId: data.locationOrig?.id,
        locationDestId: data.locationDest?.id,
        locationOrig: undefined,
        locationDest: undefined,
      };
      await handlePlanningModel("/PlanningModel", body, {
        method: "post",
        onSuccess: () => {
          addToast("Modelo de planejamento adicionado com sucesso!");
          refreshList();
          setHash("");
        },
        onError: () => {
          addToast("Erro ao adicionar modelo de planejamento.", {
            type: "error",
          });
          console.error(errorPlanningModel);
        },
      });
      return;
    }
    if (planningModelId) {
      const body = {
        ...data,
        id: planningModel?.id,
        locationOrigId: data.locationOrig?.id,
        locationDestId: data.locationDest?.id,
        locationOrig: undefined,
        locationDest: undefined,
      };

      await handlePlanningModel("/PlanningModel", body, {
        method: "put",
        onSuccess: () => {
          addToast("Modelo de planejamento atualizado com sucesso!");
          refreshList();
          setHash("");
        },
        onError: () => {
          addToast("Erro ao atualizar modelo de planejamento.", {
            type: "error",
          });
          console.error(errorPlanningModel);
        },
      });
      return;
    }
  };

  useLayoutEffect(() => {
    if (isToAddPlanningModel) {
      methods.reset();
    }
  }, [methods.reset, isToAddPlanningModel]);
  return {
    isToAddPlanningModel,
    planningModelId,
    methods,
    planningModel,
    isLoading,
    handleSubmit: methods.handleSubmit(handleSubmit),
  };
};
