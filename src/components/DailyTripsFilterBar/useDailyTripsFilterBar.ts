import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import dayjs, { Dayjs } from "dayjs";

interface FormFields {
  fleetGroupCode: string;
  locationDestId: string;
  fleetGroupId: string;
  locationOrigId: string;
  tripDate: Dayjs;
  sto: string;
  flgStatus: string;
}

const dateOrDayjsSchema = z.custom(
  (val) => val instanceof Date || dayjs.isDayjs(val),
  {
    message: "Data é obrigatório",
  },
);

const schema = z.object({
  fleetGroupCode: z.string().optional(),
  fleetGroupId: z.string().optional(),
  locationOrigId: z.string().optional(),
  locationDestId: z.string().optional(),
  tripDate: dateOrDayjsSchema,
  sto: z.string().optional(),
  flgStatus: z.string().optional(),
});

export function useDailyTripsFilterBar() {
  const router = useRouter();
  const params = useSearchParams();
  const methods = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: {
      fleetGroupCode: params.get("fleetGroupCode") || "",
      fleetGroupId: params.get("fleetGroupId") || "",
      locationDestId: params.get("locationDestId") || "",
      locationOrigId: params.get("locationOrigId") || "",
      tripDate: params.get("tripDate")
        ? dayjs(params.get("tripDate"))
        : dayjs(),
      sto: params.get("sto") || "",
      flgStatus: params.get("flgStatus") || "",
    },
  });

  const onSubmit = (data: FormFields) => {
    const params = new URLSearchParams();
    Object.entries(data).forEach(([key, value]) => {
      if (dayjs.isDayjs(value)) {
        params.append(key, value.format("YYYY-MM-DD"));
      } else if (value) {
        params.append(key, value);
      }
    });
    router.push(`/daily-trips?${params.toString()}`);
  };

  return {
    methods,
    onSubmit,
  };
}
