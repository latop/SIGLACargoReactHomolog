import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs, { Dayjs } from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";
import customParseFormat from "dayjs/plugin/customParseFormat";

import "dayjs/locale/pt-br";
import { z } from "zod";

dayjs.extend(customParseFormat);

interface FormFields {
  start: Dayjs | null;
  end: Dayjs | null;
  locationGroupCode: string;
}

const dateOrDayjsSchema = z.custom(
  (val) => val instanceof Date || dayjs.isDayjs(val),
  {
    message: "Data é obrigatório",
  },
);

const schema = z.object({
  start: dateOrDayjsSchema,
  end: dateOrDayjsSchema,
  locationGroupCode: z.string().min(1, { message: "Obrigatório*" }),
});

export function useTripOptmizationFilterBar() {
  const params = useSearchParams();
  const router = useRouter();

  const methods = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: {
      start: params.get("start") ? dayjs(params.get("start")) : dayjs(),
      end: params.get("end") ? dayjs(params.get("end")) : dayjs(),
      locationGroupCode: "",
    },
  });

  const onSubmit = (data: FormFields) => {
    const params = new URLSearchParams();
    Object.entries(data).forEach(([key, value]) => {
      if (dayjs.isDayjs(value)) {
        params.append(key, value.format("YYYY-MM-DD"));
      }
    });
    params.append("locationGroupCode", data.locationGroupCode);
    router.push(`/trip-optimization?${params.toString()}`);
  };

  return {
    methods,
    onSubmit,
  };
}
