"use client";

import { useTimezoneValue } from "@/features/TimezoneValue/useTimezoneValue";
import { useTimezone } from "@/features/Timezone/useTimezone";
import { useFetch } from "@/hooks/useFetch";
import { useHash } from "@/hooks/useHash";
import { useToast } from "@/hooks/useToast";
import { TimezoneValue } from "@/interfaces/parameters";
import { fetchTimezoneValueById } from "@/services/parameters";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLayoutEffect } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import { z } from "zod";
import dayjs from "dayjs";

export const timezoneValueSchema = z.object({
  timezone: z.object({
    id: z.string(),
    code: z.string(),
    description: z.string(),
  }),
  value: z.coerce.number().min(-12).max(14, {
    message: "Valor deve estar entre -12 e 14",
  }),
  start: z.any(),
  end: z.any(),
});

export type TimezoneValueFormType = z.infer<typeof timezoneValueSchema>;

export const useTimezoneValueDialog = () => {
  const { refreshList } = useTimezoneValue();
  const { timezones } = useTimezone();
  const methods = useForm<TimezoneValueFormType>({
    resolver: zodResolver(timezoneValueSchema),
    defaultValues: {
      timezone: {
        id: "",
        code: "",
        description: "",
      },
      value: 0,
      start: null,
      end: null,
    },
  });
  const { addToast } = useToast();
  const [handleTimezoneValue, { error: errorTimezoneValue }] = useFetch();

  const [hash, setHash] = useHash();

  const isToAddTimezoneValue = !!(hash as string)?.match(
    /#add-timezone-value/,
  )?.[0];
  const timezoneValueId = (hash as string)?.match(
    /#timezone-value-id-(.+)/,
  )?.[1];

  const {
    data: timezoneValue,
    error,
    isLoading,
  } = useSWR<TimezoneValue>(
    timezoneValueId
      ? { url: `timezone-value-${timezoneValueId}`, id: timezoneValueId }
      : null,
    fetchTimezoneValueById,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      onSuccess: (data) => {
        if (timezoneValueId) {
          methods.reset({
            timezone: data.timezone,
            value: data.value,
            start: dayjs(data?.start).format(),
            end: dayjs(data?.end).format(),
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

  const handleSubmit = async (data: TimezoneValueFormType) => {
    if (isToAddTimezoneValue) {
      //   {
      //     "timezoneId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      //     "start": "2010-01-01T00:00:00",
      //     "end": "2100-12-31T00:00:00",
      //     "value": -3.00,
      //     "timezone": {
      //         "code": "UTC -03:00",
      //         "description": "TIME ZONE UTC -03:00",
      //         "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      //         "createAt": "2022-12-31T01:20:11.5910969",
      //         "updateAt": "2023-05-24T20:53:39.4807348",
      //         "userIdCreate": null,
      //         "userIdUpdate": null
      //     },
      //     "id": "db1a3c35-13fa-4096-9b06-061c4781fe35",
      //     "createAt": "2023-03-16T22:33:38.5181399",
      //     "updateAt": "2023-09-11T03:42:40.7134444",
      //     "userIdCreate": null,
      //     "userIdUpdate": null
      // }
      const body = {
        start: dayjs(data?.start).format("YYYY-MM-DDTHH:mm:ss"),
        end: dayjs(data?.end).format("YYYY-MM-DDTHH:mm:ss"),
        timezoneId: data?.timezone?.id,
        value: data?.value,
      };
      await handleTimezoneValue("/TimezoneValue", body, {
        method: "post",
        onSuccess: () => {
          addToast("Valor de fuso horário adicionado com sucesso!");
          refreshList();
          setHash("");
        },
        onError: () => {
          addToast("Erro ao adicionar valor de fuso horário.", {
            type: "error",
          });
          console.error(errorTimezoneValue);
        },
      });
      return;
    }
    if (timezoneValueId) {
      const body = {
        id: timezoneValue?.id,
        start: dayjs(data?.start).format(),
        end: dayjs(data?.end).format(),
        timezoneId: data?.timezone?.id,
        // timezone: data?.timezone,
        value: data?.value,
      };

      await handleTimezoneValue("/TimezoneValue", body, {
        method: "put",
        onSuccess: () => {
          addToast("Valor de fuso horário atualizado com sucesso!");
          refreshList();
          setHash("");
        },
        onError: () => {
          addToast("Erro ao atualizar valor de fuso horário.", {
            type: "error",
          });
          console.error(errorTimezoneValue);
        },
      });
      return;
    }
  };

  useLayoutEffect(() => {
    if (isToAddTimezoneValue) {
      methods.reset();
    }
  }, [methods.reset, isToAddTimezoneValue]);
  return {
    isToAddTimezoneValue,
    timezoneValueId,
    methods,
    timezoneValue,
    isLoading,
    handleSubmit: methods.handleSubmit(handleSubmit),
    timezones,
  };
};
