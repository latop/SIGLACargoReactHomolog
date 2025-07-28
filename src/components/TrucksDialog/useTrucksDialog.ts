"use client";

import { useTrucks } from "@/features/Trucks/useTrucks";
import { useFetch } from "@/hooks/useFetch";
import { useHash } from "@/hooks/useHash";
import { useToast } from "@/hooks/useToast";
import { useGetTruckQuery } from "@/services/query/vehicles";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const dateOrDayjsSchema = z.union([
  z.instanceof(Date),
  z.custom((val) => dayjs.isDayjs(val), { message: "Invalid date format" }),
]);

export const truckSchema = z.object({
  startDate: z.string(),
  endDate: z.string(),
  id: z.string().optional(),
  isRefurbished: z.boolean().default(false),
  stateId: z.string(),
  chassisNumber: z.string().optional(),
  licensePlate: z.string(),
  regulatoryNumber: z.string().optional(),
  regulatoryValidity: z.string().optional().nullable(),
  manufactureYear: dateOrDayjsSchema,
  serialNumber: z.string(),
  tare: z.coerce.number().optional(),
  capacity: z.coerce.number().optional(),
  fleetCode: z.string().optional(),
  locationGroupId: z.string(),
  fleetTypeId: z.string(),
  integrationCode: z.string(),
  note: z.string().optional().default(""),
});

export type TruckFormType = z.infer<typeof truckSchema>;

export const useTrucksDialog = () => {
  const [hash, setHash] = useHash();
  const [handleFetch, { loading: loadingTruckFetch }] = useFetch();
  const { addToast } = useToast();
  const methods = useForm<TruckFormType>({
    resolver: zodResolver(truckSchema),
  });
  const { refetchTrucks } = useTrucks();
  const isAdd = !!(hash as string)?.match(/#add-truck/);
  const truckId = (hash as string)?.match(/#truck-id-(.+)/)?.[1];

  const dialogTitle = isAdd ? "Adicionar Caminhão" : "Editar Caminhão";

  const handleErrors = useCallback(
    (data: TruckFormType) => {
      Object.keys(data).forEach((key) => {
        if (
          methods.formState.errors[key as keyof TruckFormType] &&
          key !== "regulatoryValidity"
        ) {
          methods.setError(key as keyof TruckFormType, {
            message: "*Obrigatório",
          });
        }
      });
    },
    [methods.formState.errors],
  );
  const { data, isFetching: isLoadingTruck } = useGetTruckQuery(truckId);

  const handleSubmit = async (data: TruckFormType) => {
    const body: TruckFormType = {
      ...data,
      manufactureYear: dayjs(`${data.manufactureYear}`).format("YYYY"),
      stateId: data.stateId,
    };

    if (isAdd) {
      return await handleFetch("/Truck", body, {
        method: "post",
        onSuccess: () => {
          addToast("Caminhão adicionado com sucesso!", { type: "success" });
          setHash("");
          refetchTrucks();
        },
        onError: (error) => addToast(error.message, { type: "error" }),
      });
    }

    return await handleFetch(`/Truck`, body, {
      method: "put",
      onSuccess: () => {
        addToast("Caminhão atualizado com sucesso!", { type: "success" });
        setHash("");
        refetchTrucks();
      },
      onError: (error) => addToast(error.message, { type: "error" }),
    });
  };

  useEffect(() => {
    if (isAdd) {
      methods.reset({});
    }
  }, [isAdd]);

  useEffect(() => {
    handleErrors(methods.getValues());
  }, [handleErrors, methods.formState.errors]);

  const handleFormDefaults = useCallback(() => {
    const manufactureYear =
      truckId && !isAdd
        ? dayjs(`${data.manufactureYear}-02-02`).toDate()
        : null;

    methods.reset({
      ...data,
      licensePlate: data?.licensePlate,
      manufactureYear,
      isRefurbished: data?.isRefurbished ? true : false,
    });
  }, [data, methods]);

  useEffect(() => {
    if (isAdd) {
      methods.reset({});
    }
  }, [isAdd]);

  useEffect(() => {
    handleFormDefaults();
  }, [handleFormDefaults]);

  return {
    methods,
    loadingTruckFetch,
    dialogTitle,
    truckId,
    isLoadingTruck,
    onSubmit: methods.handleSubmit(handleSubmit),
    isAdd,
  };
};
