import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import dayjs, { Dayjs } from "dayjs";

interface FormFields {
  fleetGroupId: string;
  locationGroupId: string;
  locationGroupCode: string;
  driverId: string;
  licensePlate: string;
  nickName?: string;
  fleetGroupCode?: string;
  tripDate: Dayjs;
}

const dateOrDayjsSchema = z.custom(
  (val) => val instanceof Date || dayjs.isDayjs(val),
  {
    message: "Data é obrigatório",
  },
);

const schema = z.object({
  fleetGroupId: z.string().optional(),
  locationGroupId: z.string().optional(),
  locationGroupCode: z.string().optional(),
  driverId: z.string().optional(),
  nickName: z.string().optional(),
  licensePlate: z.string().optional(),
  fleetGroupCode: z.string().optional(),
  tripDate: dateOrDayjsSchema,
});

export function useVehiclePlanningsFilterBar() {
  const router = useRouter();
  const params = useSearchParams();
  const methods = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: {
      fleetGroupId: params.get("fleetGroupId") || "",
      locationGroupId: params.get("locationGroupId") || "",
      locationGroupCode: params.get("locationGroupCode") || "",
      licensePlate: params.get("licensePlate") || "",
      fleetGroupCode: params.get("fleetGroupCode") || "",
      nickName: params.get("nickName") || "",
      tripDate: params.get("tripDate")
        ? dayjs(params.get("tripDate"))
        : dayjs(),
      driverId: params.get("driverId") || "",
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
    router.push(`/vehicle-planning?${params.toString()}`);
  };

  return {
    methods,
    onSubmit,
  };
}
