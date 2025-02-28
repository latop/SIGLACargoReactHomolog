/* eslint-disable prettier/prettier */
import { useFetch } from "@/hooks/useFetch";
import { useHash } from "@/hooks/useHash";
import { useLines } from "@/hooks/useLines";
import { useToast } from "@/hooks/useToast";
import { Line } from "@/interfaces/lines";
import { fetchLineById } from "@/services/trips";
import dayjs from "dayjs";
import { FieldValues, useForm } from "react-hook-form";
import useSWR from "swr";

export function useUpdateLineDialog() {
  const [hash] = useHash();
  const { refetchLines } = useLines();
  const match = (hash as string)?.match(/#line-id-(.+)/);
  const lineId = match?.[1];

  const normalizeData = (data: Line | undefined) => {
    const lineDefaultValues = {
      line: {
        ...data?.line,
        freqFri: data?.line.freqFri ? 1 : 0,
        freqMon: data?.line.freqMon ? 1 : 0,
        freqSat: data?.line.freqSat ? 1 : 0,
        freqSun: data?.line.freqSun ? 1 : 0,
        freqThu: data?.line.freqThu ? 1 : 0,
        freqTue: data?.line.freqTue ? 1 : 0,
        freqWed: data?.line.freqWed ? 1 : 0,
        description: data?.line.description,
        code: data?.line.code,
        locationOrig: data?.line.locationOrig.code,
        locationDest: data?.line.locationDest.code,
        locationOrigId: data?.line.locationOrig.id,
        locationDestId: data?.line.locationDest.id,
        tripType: data?.line.tripType,
        tripTypeId: data?.line.tripType?.id,
        fleetGroupId: data?.line.fleetGroupId,
      },
      lineSections: data?.lineSections?.map((section) => {
        return {
          ...section,
          locationOrig: section.locationOrig.code,
          locationDest: section.locationDest.code,
          locationGroupId: section.locationGroupId,
        }
      }),
    };

    return lineDefaultValues;
  };

  const { data: lineData, isLoading: isLoadingLine, mutate: refreshLine } = useSWR<Line>(
    lineId
      ? {
        id: lineId,
        url: "/returnline",
      }
      : null,
    fetchLineById,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
      onSuccess: (data) => {
        methods.reset(normalizeData(data));
      },
    },
  );

  const methods = useForm();

  const { addToast } = useToast();
  const [lineCreate, { loading: loadingCreate }] = useFetch();
  const [, setHash] = useHash();

  const handleSubmit = async (data: FieldValues) => {
    const body = {
      line: {
        id: data.line.id,
        startDate: dayjs(data.line.startDate).format("YYYY-MM-DD"),
        endDate: dayjs(data.line.endDate).format("YYYY-MM-DD"),
        freqFri: data.line.freqFri ? 1 : 0,
        freqMon: data.line.freqMon ? 1 : 0,
        freqSat: data.line.freqSat ? 1 : 0,
        freqSun: data.line.freqSun ? 1 : 0,
        freqThu: data.line.freqThu ? 1 : 0,
        freqTue: data.line.freqTue ? 1 : 0,
        freqWed: data.line.freqWed ? 1 : 0,
        description: data.line.description,
        code: data.line.code,
        tripType: data.line.tripType,
        tripTypeId: data.line.tripType?.id,
        locationOrigId: data.line.locationOrigId,
        locationDestId: data.line.locationDestId,
        fleetGroupId: data.line.fleetGroupId,
        overtimeAllowed: data?.line.overtimeAllowed,
        cost: data?.line.cost,
      },

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      lineSections: data?.lineSections?.map((section: any) => {
        console.log(section);
        return {
          id: section?.id,
          lineId: section?.lineId,
          locationOrigId: section?.locationOrigId,
          locationDestId: section?.locationDestId,
          stopTypeId: section?.stopTypeId,
          duration: Number(section?.duration),
          locationGroupId: section?.locationGroupId,
        };
      }),
    };

    return await lineCreate("/updateline", body, {
      onSuccess: () => {
        addToast("Rota atualizada com sucesso!", { type: "success" });
        refetchLines();
        setHash("");
        methods.reset({});
        refetchLines()
        refreshLine()
      },
      onError: (error) => addToast(error.message, { type: "error" }),
    });
  };

  return {
    methods,
    handleSubmit,
    loadingCreate,
    isLoadingLine: isLoadingLine && !lineData,
  };
}
