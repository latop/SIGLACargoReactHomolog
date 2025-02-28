"use client";

import { useHash } from "@/hooks/useHash";
import { useToast } from "@/hooks/useToast";
import {
  useCreateLocationMution,
  useEditLocationMution,
} from "@/services/mutation/trips";
import { useGetLocationByIdQuery } from "@/services/query/trips";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  code: z.string(),
  codeIntegration1: z.string().optional(), //gps
  codeIntegration2: z.string().optional(), // TMS
  name: z.string(),
  cityId: z.string().optional(),
  city: z.record(z.any()).optional(),
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
  locationGroup: z.record(z.any()).optional(),
  locationGroupId: z.string().optional().nullable(),
  locationTypeId: z.string(),
  locationType: z.record(z.any()).optional(),
  timezoneId: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type LocationFormType = z.infer<typeof schema>;

export const useLocationsDialog = () => {
  const [hash, setHash] = useHash();
  const { addToast } = useToast();

  const isToAddLocation = (hash as string)?.match(/#add-location/);
  const locationId = (hash as string)?.match(/#location-id-(.+)/)?.[1];
  const dialogTitle = isToAddLocation
    ? "Adicionar Localização"
    : "Editar Localização";

  const { data: location, isFetching: isLoadingLocation } =
    useGetLocationByIdQuery(locationId);
  const methods = useForm<LocationFormType>({
    resolver: zodResolver(schema),
  });
  const { mutateAsync: createLocation } = useCreateLocationMution();
  const { mutate: editLocation } = useEditLocationMution();

  const handleFormDefaults = useCallback(() => {
    methods.reset({
      ...location,
      cityId: location?.city?.id,
      timezoneId: location?.timezoneId,
    });
  }, [location, methods]);

  useEffect(() => {
    handleFormDefaults();
  }, [handleFormDefaults]);

  const handleSubmit = async (data: LocationFormType) => {
    const body = {
      locationGroupId: data.locationGroupId,
      locationTypeId: data.locationTypeId,
      name: data.name,
      code: data.code,
      codeIntegration1: data.codeIntegration1,
      codeIntegration2: data.codeIntegration2,
      latitude: data.latitude,
      longitude: data.longitude,
      cityId: data.cityId,
      timezoneId: data.timezoneId,
    };

    if (isToAddLocation && !locationId) {
      return await createLocation(body, {
        onSuccess: () => {
          addToast("Localizada cadastrada com sucesso!", { type: "success" });
          setHash("");
          methods.reset({});
        },
      });
    }
    const bodyToEdit = {
      ...body,
      id: locationId,
    };
    return editLocation(bodyToEdit, {
      onSuccess: () => {
        addToast("Localizada alterada com sucesso!", { type: "success" });
        setHash("");
        methods.reset({});
      },
    });
  };

  const handleErrors = useCallback(
    (data: LocationFormType) => {
      Object.keys(data).forEach((key) => {
        if (
          methods.formState.errors[key as keyof LocationFormType] &&
          key !== "locationGroupId" &&
          key !== "locationGroup"
        ) {
          methods.setError(key as keyof LocationFormType, {
            message: "*Obrigatório",
          });
        }
      });
    },
    [methods.formState.errors],
  );

  useEffect(() => {
    handleErrors(methods.getValues());
  }, [handleErrors, methods.formState.errors]);

  return {
    methods,
    onSubmit: methods.handleSubmit(handleSubmit),
    dialogTitle,
    isLoadingLocation,
    locationId,
  };
};
