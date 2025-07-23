import { useFetch } from "@/hooks/useFetch";
import { useHash } from "@/hooks/useHash";
import { useLines } from "@/hooks/useLines";
import { useToast } from "@/hooks/useToast";
import { fetchLineById } from "@/services/trips";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

const lineSectionSchema = z.object({
  id: z.string().uuid().optional(),
  lineId: z.string().uuid().optional(),
  section: z.number().int().min(1),
  locationOrigId: z.string().optional(),
  locationOrig: z.any().optional(),
  locationDestId: z.string().optional(),
  locationDest: z.any().optional(),
  duration: z.number().nullable(),
  stopTypeId: z.string().uuid().optional(),
  stopType: z.any().optional(),
  locationGroupId: z.string().uuid().nullable(),
  logisticHub: z.boolean().optional().default(false),
});

const lineSchema = z.object({
  line: z.object({
    id: z.string().uuid(),
    code: z.string().min(1, "Code is required"),
    description: z.string().min(1, "Description is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    freqMon: z.number().int().min(0).max(1),
    freqTue: z.number().int().min(0).max(1),
    freqWed: z.number().int().min(0).max(1),
    freqThu: z.number().int().min(0).max(1),
    freqFri: z.number().int().min(0).max(1),
    freqSat: z.number().int().min(0).max(1),
    freqSun: z.number().int().min(0).max(1),
    overtimeAllowed: z.number().int().min(0),
    locationOrigId: z.string().optional(),
    locationOrigCode: z.string().optional(),
    locationDestId: z.string().optional(),
    locationDestCode: z.string().optional(),
    cost: z.number().int().min(0),
    fleetGroupId: z.string().uuid(),
    tripTypeId: z.string().uuid().optional(),
  }),
  lineSections: z.array(lineSectionSchema).optional(),
});
export type LineSection = z.infer<typeof lineSectionSchema>;
export type LineFormData = z.infer<typeof lineSchema>;

export function useUpdateLineDialog() {
  const [hash] = useHash();
  const { refetchLines } = useLines();

  const isToAddLine = hash.match("#add-line")?.[0];
  const match = (hash as string)?.match(/#line-id-(.+)/);
  const lineId = match?.[1];

  const {
    data: lineData,
    isLoading: isLoadingLine,
    mutate: refreshLine,
  } = useSWR<LineFormData>(
    lineId ? { id: lineId, url: `returnline-${lineId}` } : null,
    fetchLineById,
    {
      onSuccess: (data) => {
        if (lineId) {
          methods.reset(data);
          return;
        }
        methods.reset();
      },
      onError: (error) => {
        console.error(error);
        methods.reset();
      },
    },
  );

  const methods = useForm<LineFormData>({
    resolver: zodResolver(lineSchema),
    defaultValues: {
      line: {
        id: "00000000-0000-0000-0000-000000000000",
        code: "",
        description: "",
        startDate: "",
        endDate: "",
        freqMon: 1,
        freqTue: 1,
        freqWed: 1,
        freqThu: 1,
        freqFri: 1,
        freqSat: 1,
        freqSun: 1,
        overtimeAllowed: 0,
        locationOrigId: "",
        locationDestId: "",
        cost: 0,
        fleetGroupId: "",
        tripTypeId: "",
      },
      lineSections: [],
    },
  });

  const { addToast } = useToast();
  const [lineCreate, { loading: loadingCreate }] = useFetch();
  const [, setHash] = useHash();

  const handleSubmit = async (data: LineFormData) => {
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
        tripTypeId: data.line.tripTypeId,
        locationOrigId: data.line.locationOrigId,
        locationDestId: data.line.locationDestId,
        fleetGroupId: data.line.fleetGroupId,
        overtimeAllowed: data?.line.overtimeAllowed,
        cost: data?.line.cost,
      },
      lineSections: data?.lineSections?.map(
        (lineSection: LineSection): LineSection => {
          return {
            id: lineSection.id || undefined,
            section: lineSection.section,
            lineId: lineSection.lineId,
            locationOrigId: lineSection.locationOrigId,
            locationDestId: lineSection.locationDestId,
            locationGroupId: lineSection.locationGroupId,
            locationOrig: !isToAddLine ? undefined : lineSection.locationOrig,
            locationDest: !isToAddLine ? undefined : lineSection.locationDest,
            stopTypeId: lineSection.stopTypeId,
            stopType: !isToAddLine ? undefined : lineSection.stopType,
            logisticHub: lineSection.logisticHub,
            duration: lineSection.duration,
          };
        },
      ),
    };

    return await lineCreate("/updateline", body, {
      onSuccess: () => {
        addToast("Rota atualizada com sucesso!", { type: "success" });
        setHash("");
        methods.reset({});
        refetchLines();
        refreshLine();
      },
      onError: (error) => addToast(error.message, { type: "error" }),
    });
  };
  const lineSections = methods.watch("lineSections");
  const countSections = lineSections?.length;

  useEffect(() => {
    if (isToAddLine) {
      methods.reset();
      return;
    }
    if (lineData) {
      methods.reset(lineData);
      return;
    }
  }, [methods.reset, lineData, isToAddLine]);

  return {
    methods,
    handleSubmit,
    loadingCreate,
    isLoadingLine: isLoadingLine,
    lineSections,
    countSections,
    lineId,
    lineData,
  };
}
