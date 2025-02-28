import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs, { Dayjs } from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";
import customParseFormat from "dayjs/plugin/customParseFormat";

import "dayjs/locale/pt-br";
import { z } from "zod";

dayjs.extend(customParseFormat);

interface FormFields {
  startDate: Dayjs | null;
  endDate: Dayjs | null;
}

const dateOrDayjsSchema = z.custom(
  (val) => val instanceof Date || dayjs.isDayjs(val),
  {
    message: "Data é obrigatório",
  },
);

const schema = z.object({
  startDate: dateOrDayjsSchema,
  endDate: dateOrDayjsSchema,
});

export function useImportTripsFilterBar() {
  const params = useSearchParams();
  const router = useRouter();

  const methods = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: {
      startDate: params.get("startDate")
        ? dayjs(params.get("startDate"))
        : dayjs(),

      endDate: params.get("endDate")
        ? dayjs(params.get("endDate"))
        : dayjs().add(1, "day"),
    },
  });

  const onSubmit = (data: FormFields) => {
    const params = new URLSearchParams();
    Object.entries(data).forEach(([key, value]) => {
      if (dayjs.isDayjs(value)) {
        params.append(key, value.format("YYYY-MM-DD"));
      }
    });
    router.push(`/import-trips?${params.toString()}`);
  };

  return {
    methods,
    onSubmit,
  };
}
