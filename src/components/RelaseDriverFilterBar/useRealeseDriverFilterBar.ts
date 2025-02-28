import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs, { Dayjs } from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";
import customParseFormat from "dayjs/plugin/customParseFormat";

import "dayjs/locale/pt-br";
import { z } from "zod";

dayjs.extend(customParseFormat);

interface FormFields {
  dtRef: Dayjs | null;
  locOrig: string;
  demand?: string;
  nickName?: string;
  licensePlate?: string;
  fleetCode?: string;
  releaseStatus?: string;
}

const dateOrDayjsSchema = z.custom(
  (val) => val instanceof Date || dayjs.isDayjs(val),
  {
    message: "Data é obrigatório",
  },
);

const schema = z.object({
  dtRef: dateOrDayjsSchema,
  locOrig: z.string({
    required_error: "*Obrigatório",
  }),
  demand: z.string(),
  nickName: z.string().optional(),
  licensePlate: z.string().optional(),
  fleetCode: z.string().optional(),
  releaseStatus: z.string().optional(),
});

export function useReleaseDriverFilterBar() {
  const params = useSearchParams();
  const router = useRouter();

  const methods = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: {
      licensePlate: params.get("licensePlate") || "",
      nickName: params.get("nickName") || "",
      demand: params.get("demand") || "",
      fleetCode: params.get("fleetCode") || "",
      locOrig: params.get("locOrig") || "",
      dtRef: dayjs(params.get("dtRef")).isValid()
        ? dayjs(params.get("dtRef"))
        : dayjs(),
      releaseStatus: params.get("releaseStatus") || "notReleased",
    },
  });

  const onSubmit = (data: FormFields) => {
    if (!data?.locOrig.length) {
      methods.setError("locOrig", { message: "*Obrigatório" });
      return;
    }

    const params = new URLSearchParams();
    Object.entries(data).forEach(([key, value]) => {
      if (dayjs.isDayjs(value)) {
        params.append(key, value.format("YYYY-MM-DD"));
      } else if (value) {
        params.append(key, value);
      }
    });
    router.push(`/release-driver?${params.toString()}`);
  };

  return {
    methods,
    onSubmit,
  };
}
