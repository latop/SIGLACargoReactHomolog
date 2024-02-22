import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import dayjs from "dayjs";
import { Dayjs } from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "dayjs/locale/pt-br";

dayjs.extend(customParseFormat);

interface FormFields {
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  nickName?: string;
  fleetGroupCode?: string;
  locationGroupCode?: string;
  positionCode?: string;
}

const dateOrDayjsSchema = z.custom(
  (val) => val instanceof Date || dayjs.isDayjs(val),
  {
    message: "Data é obrigatório",
  },
);

// Esquema com validações adicionais para intervalo de datas e comparação de datas
const schema = z
  .object({
    startDate: dateOrDayjsSchema,
    endDate: dateOrDayjsSchema,
    nickName: z.string().optional(),
    fleetGroupCode: z.string().optional(),
    locationGroupCode: z.string().optional(),
    positionCode: z.string().optional(),
  })
  .refine(
    (data) => {
      const { startDate, endDate } = data;
      if (dayjs(startDate as Dayjs | Date).isAfter(endDate as Dayjs | Date)) {
        return false;
      }
      const diffDays = dayjs(endDate as Dayjs | Date).diff(
        dayjs(startDate as Dayjs | Date),
        "day",
      );
      return diffDays <= 45;
    },
    {
      // Mensagemde erro para validação falha
      message: "O intervalo entre as datas deve ser de no máximo 45 dias",
      path: ["startDate"],
    },
  );

export function useJourneyFilterBar() {
  const router = useRouter();
  const params = useSearchParams();
  const methods = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: {
      startDate: params.get("startDate")
        ? dayjs(params.get("startDate"))
        : dayjs(),
      endDate: params.get("endDate")
        ? dayjs(params.get("endDate"))
        : dayjs().add(7, "days"),
      nickName: params.get("nickName") || "",
      fleetGroupCode: params.get("fleetGroupCode") || "",
      locationGroupCode: params.get("locationGroupCode") || "",
      positionCode: params.get("positionCode") || "",
    },
  });

  const onSubmit = (data: FormFields) => {
    const query = new URLSearchParams();
    Object.entries(data).forEach(([key, value]) => {
      if (dayjs(value).isValid()) {
        query.append(key, dayjs(value).format("MM-DD-YYYY"));
      } else if (value) {
        query.append(key, value);
      }
    });

    router.push(`/drivers-schedule?${query.toString()}`);
  };

  return {
    methods,
    onSubmit,
  };
}
