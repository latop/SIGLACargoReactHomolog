"use client";

import { useStates } from "@/features/States/useStates";
import { useFetch } from "@/hooks/useFetch";
import { useHash } from "@/hooks/useHash";
import { useToast } from "@/hooks/useToast";
import { State } from "@/interfaces/parameters";
import { fetchStateById } from "@/services/parameters";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLayoutEffect } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import { z } from "zod";

export const stateSchema = z.object({
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
  countryId: z.string().min(1, {
    message: "Obrigatório",
  }),
  regionId: z.string().nullable(),
  country: z.object({
    id: z.string().nullable(),
    code: z.string().nullable(),
    name: z.string().nullable(),
  }),
  region: z.object({
    id: z.string().nullable(),
    code: z.string().nullable(),
    name: z.string().nullable(),
  }),
});

export type StateFormType = z.infer<typeof stateSchema>;

export const useStatesDialog = () => {
  const { refreshList } = useStates();
  const methods = useForm<StateFormType>({
    resolver: zodResolver(stateSchema),
    defaultValues: {
      code: "",
      name: "",
      countryId: "",
      regionId: null,
      country: {
        id: "",
        code: "",
        name: "",
      },
      region: {
        id: "",
        code: "",
        name: "",
      },
    },
  });
  const { addToast } = useToast();
  const [handleState, { error: errorState }] = useFetch();

  const [hash, setHash] = useHash();

  const isToAddState = !!(hash as string)?.match(/#add-state/)?.[0];
  const stateId = (hash as string)?.match(/#state-id-(.+)/)?.[1];

  const {
    data: state,
    error,
    isLoading,
  } = useSWR<State>(
    stateId ? { url: `state-${stateId}`, id: stateId } : null,
    fetchStateById,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      onSuccess: (data) => {
        if (stateId) {
          methods.reset({
            code: data.code,
            name: data.name,
            countryId: data.countryId,
            regionId: data.regionId,
            country: {
              id: data.country?.id,
              name: data.country?.name,
              code: data.country?.code,
            },
            region: {
              id: data.region?.id,
              name: data.region?.name,
              code: data.region?.code,
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

  const handleSubmit = async (data: StateFormType) => {
    if (isToAddState) {
      const body = {
        ...data,
        countryId: data.countryId,
        regionId: data.regionId,
        country: undefined,
        region: undefined,
      };
      await handleState("/States", body, {
        method: "post",
        onSuccess: () => {
          addToast("Estado adicionado com sucesso!");
          refreshList();
          setHash("");
        },
        onError: () => {
          addToast("Erro ao adicionar estado.", { type: "error" });
          console.error(errorState);
        },
      });
      return;
    }
    if (stateId) {
      const body = {
        ...data,
        id: state?.id,
        countryId: data.countryId,
        regionId: data.regionId,
        country: undefined,
        region: undefined,
      };

      await handleState("/States", body, {
        method: "put",
        onSuccess: () => {
          addToast("Estado atualizado com sucesso!");
          refreshList();
          setHash("");
        },
        onError: () => {
          addToast("Erro ao atualizar estado.", { type: "error" });
          console.error(errorState);
        },
      });
      return;
    }
  };

  useLayoutEffect(() => {
    if (isToAddState) {
      methods.reset();
    }
  }, [methods.reset, isToAddState]);

  return {
    isToAddState,
    stateId,
    methods,
    state,
    isLoading,
    handleSubmit: methods.handleSubmit(handleSubmit),
  };
};
