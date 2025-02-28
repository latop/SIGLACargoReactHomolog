import { useDailyTripsByPeriod } from "@/hooks/useDailyTripsByPeriod";
import { useFetch } from "@/hooks/useFetch";
import { useHash } from "@/hooks/useHash";
import { useToast } from "@/hooks/useToast";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";

const dateOrDayjsSchema = z.custom(
  (val) => val instanceof Date || dayjs.isDayjs(val),
  { message: "Data é obrigatório" },
);
const NewTruckAssignmentSchema = z.object({
  truckId: z.string().min(1, { message: "Obrigatório*" }),
  driverId: z.string().min(1, { message: "Obrigatório*" }),
  dtRef: dateOrDayjsSchema,
  startTime: dateOrDayjsSchema,
  endTime: dateOrDayjsSchema,
});

type NewTruckAssignmentForm = z.infer<typeof NewTruckAssignmentSchema>;

type DateType = {
  startTime: string;
  endTime: string;
};

export const useNewTruckAssigment = () => {
  const { refetch } = useDailyTripsByPeriod();
  const methods = useForm<NewTruckAssignmentForm>({
    resolver: zodResolver(NewTruckAssignmentSchema),
    defaultValues: {
      dtRef: dayjs(),
      startTime: dayjs(),
      endTime: dayjs(),
      driverId: "",
      truckId: "",
    },
  });

  const { addToast } = useToast();

  const [postTruckAssignment, { loading: loadingPostTruckAssignment }] =
    useFetch();

  const [, setHash] = useHash();

  const handleMidnightCrossing = ({
    date,
    dtRef,
  }: {
    date: DateType;
    dtRef: string;
  }) => {
    const parsedDtRef = dayjs(dtRef);
    const parsedStartTime = dayjs(date.startTime, "HH:mm:ss");
    const parsedEndTime = dayjs(date.endTime, "HH:mm:ss");

    let newDate = parsedDtRef.clone();
    if (parsedEndTime.isBefore(parsedStartTime))
      newDate = newDate.add(1, "day");

    return {
      dtRef: parsedDtRef.format("YYYY-MM-DD"),
      startTime:
        parsedDtRef.format("YYYY-MM-DD") +
        "T" +
        parsedStartTime.format("HH:mm:ss"),
      endTime:
        newDate.format("YYYY-MM-DD") + "T" + parsedEndTime.format("HH:mm:ss"),
    };
  };

  const onSubmit = async (data: FieldValues) => {
    const date = {
      startTime: data.startTime,
      endTime: data.endTime,
    };
    const { dtRef, endTime, startTime } = handleMidnightCrossing({
      date,
      dtRef: data.dtRef,
    });

    const body = {
      ...data,
      dtRef,
      endTime,
      startTime,
    };

    return await postTruckAssignment("/TruckAssignment", body, {
      onSuccess: () => {
        addToast("Atribuição executada com sucesso!", { type: "success" });
        setHash("");
        refetch();
        methods.reset();
      },
      onError: () => {
        addToast("Erro ao criar atribuição criada.", {
          type: "error",
        });
      },
    });
  };

  return {
    methods,
    onSubmit,
    loadingPostTruckAssignment,
  };
};
