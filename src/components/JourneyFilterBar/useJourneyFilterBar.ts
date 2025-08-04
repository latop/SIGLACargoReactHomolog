import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import dayjs from "dayjs";
import { Dayjs } from "dayjs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "dayjs/locale/pt-br";
import { useJourneysByPeriod } from "@/hooks/useJourneysByPeriod";
import { useDailyTripsUnallocated } from "@/hooks/useDailyTripsUnallocated";

dayjs.extend(customParseFormat);

interface FormFields {
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  demandAttrib?: string;
  locationOrigCode?: string;
  locationDestCode?: string;
  demandAvailable?: string;
  activityCode?: string;
  nickNames?: string[];
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

const schema = z
  .object({
    startDate: dateOrDayjsSchema,
    endDate: dateOrDayjsSchema,
    demandAttrib: z.string().optional(),
    locationOrigCode: z.string().optional(),
    locationDestCode: z.string().optional(),
    demandAvailable: z.string().optional(),
    nickNames: z.array(z.string()).optional(),
    activityCode: z.string().optional(),
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
      message: "O intervalo entre as datas deve ser de no máximo 45 dias",
      path: ["startDate"],
    },
  );

export function useJourneyFilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { refetch: refetchJourney } = useJourneysByPeriod();
  const { refetch: refetchDailyTrips } = useDailyTripsUnallocated();
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
      demandAttrib: params.get("demandAttrib") || "",
      locationOrigCode: params.get("locationOrigCode") || "",
      locationDestCode: params.get("locationDestCode") || "",
      demandAvailable: params.get("demandAvailable") || "",
      activityCode: params.get("activityCode") || "",
      nickNames: params.get("nickNames")?.split(",").filter(Boolean) || [],
      fleetGroupCode: params.get("fleetGroupCode") || "",
      locationGroupCode: params.get("locationGroupCode") || "",
      positionCode: params.get("positionCode") || "",
    },
  });

  const onSubmit = (data: FormFields) => {
    const query = new URLSearchParams();
    Object.entries(data).forEach(([key, value]) => {
      if (value?.isValid?.()) {
        query.append(key, dayjs(value).format("MM-DD-YYYY"));
      } else if (value) {
        query.append(key, value);
      }
    });

    const newUrl = `/drivers-schedule?${query.toString()}`;
    const oldUrl = `${pathname}?${params.toString()}`;
    if (oldUrl === newUrl) {
      refetchDailyTrips();
      refetchJourney();
    } else {
      router.push(newUrl);
    }
  };

  return {
    methods,
    onSubmit,
  };
}
