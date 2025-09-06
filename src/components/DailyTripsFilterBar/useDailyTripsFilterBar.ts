import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import dayjs from "dayjs";

const dateOrDayjsSchema = z.custom(
  (val) => val instanceof Date || dayjs.isDayjs(val),
  {
    message: "Data é obrigatório",
  },
);
const schema = z
  .object({
    fleetGroupId: z.string().optional(), // Filter1Id
    locationOrigId: z.string().optional(), // Filter2Id
    locationDestId: z.string().optional(), // Filter3Id
    tripTypeId: z.string().optional(), // Filter4Id
    companyId: z.string().optional(), // Filter5Id
    lineId: z.string().optional(), // Filter6Id
    sto: z.string().optional(), // Filter1String
    tripDate: dateOrDayjsSchema.optional(), // Filter2String
    flgStatus: z.string().optional(), // Filter3String
    licensePlate: z.string().optional(), // Filter4String
    nickName: z.string().optional(), // Filter5String
  })
  .refine(
    (data) => {
      const hasTripDate = data.tripDate && dayjs.isDayjs(data.tripDate);
      const hasSto = data.sto && data.sto.trim() !== "";

      return hasTripDate || hasSto;
    },
    {
      message: "Informe a Data da Viagem ou o STO",
      path: ["tripDate"],
    },
  )
  .refine(
    (data) => {
      const hasTripDate = data.tripDate && dayjs.isDayjs(data.tripDate);
      const hasSto = data.sto && data.sto.trim() !== "";

      return hasTripDate || hasSto;
    },
    {
      message: "Informe a Data da Viagem ou o STO",
      path: ["sto"],
    },
  );

// eslint-disable-next-line prettier/prettier
interface FormFields {
  fleetGroupId?: string; // Filter1Id
  locationOrigId?: string; // Filter2Id
  locationDestId?: string; // Filter3Id
  tripTypeId?: string; // Filter4Id
  companyId?: string; // Filter5Id
  lineId?: string; // Filter6Id
  sto?: string; // Filter1String
  tripDate?: string; // Filter2String
  flgStatus?: string; // Filter3String
  licensePlate?: string; // Filter4String
  nickName?: string; // Filter5String
}

export function useDailyTripsFilterBar() {
  const router = useRouter();
  const params = useSearchParams();
  const methods = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: {
      fleetGroupId: params.get("fleetGroupId") || "", // Filter1Id
      locationOrigId: params.get("locationOrigId") || "", // Filter2Id
      locationDestId: params.get("locationDestId") || "", // Filter3Id
      tripTypeId: params.get("tripTypeId") || "", // Filter4Id
      companyId: params.get("companyId") || "", // Filter5Id
      lineId: params.get("lineId") || "", // Filter6Id
      sto: params.get("sto") || "", // Filter1String
      tripDate: params.get("tripDate")
        ? dayjs(params.get("tripDate")).toString()
        : undefined,
      flgStatus: params.get("flgStatus") || "", // Filter3String
      licensePlate: params.get("licensePlate") || "", // Filter4String
      nickName: params.get("nickName") || "", // Filter5String
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
    router.push(`/daily-trip?${params.toString()}`);
  };

  const onClearParams = () => {
    methods.reset({});
    router.push("/daily-trip");
    setTimeout(() => window.location.reload(), 500);
  };

  return {
    methods,
    onSubmit,
    onClearParams,
  };
}
