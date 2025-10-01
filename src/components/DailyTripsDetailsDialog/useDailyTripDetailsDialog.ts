import { useEffect } from "react";
import { useDailyTripDetails } from "@/hooks/useDailyTripDetails/useDailyTripDetails";
import { useHash } from "@/hooks/useHash";
import { DailyTrip } from "@/interfaces/daily-trip";

import dayjs from "dayjs";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FleetGroupSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
});

const LineSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
});

const LocationSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
});

const TripTypeSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
});

const StopTypeSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
});

const CompanySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
});

const JustificationSchema = z.object({
  id: z.string().uuid(),
  description: z.string(),
});

const TruckSchema = z.object({
  id: z.string().uuid(),
  licensePlate: z.string(),
});

const DailyTripSectionSchema = z.object({
  id: z.string().uuid().optional(),
  dailyTripId: z.string().uuid(),
  section: z.number().int(),
  locationOrigId: z.string().uuid(),
  locationOrig: LocationSchema.optional(),
  locationDestId: z.string().uuid(),
  locationDest: LocationSchema.optional(),
  startPlanned: z.string().datetime(),
  endPlanned: z.string().datetime(),
  startActual: z.string().datetime().nullable().optional(),
  endActual: z.string().datetime().nullable().optional(),
  startEstimated: z.string().datetime().nullable().optional(),
  endEstimated: z.string().datetime().nullable().optional(),
  truckId: z.string().uuid().nullable().optional(),
  truck: TruckSchema.optional(),
  flgStatus: z.string(),
  notes: z.string().nullable().optional(),
  stopTypeId: z.string().uuid().nullable().optional(),
  stopType: StopTypeSchema.optional(),
  locationGroupId: z.string().uuid().nullable().optional(),
});

export const DailyTripSchema = z.object({
  id: z.string().uuid().optional(),
  tripNumber: z.string().min(1),
  tripDate: z.string().datetime(),
  fleetGroupId: z.string().uuid().nullable().optional(),
  fleetGroup: FleetGroupSchema.optional(),
  flgStatus: z.string().min(1),
  notes: z.string().nullable().optional(),
  lineId: z.string().uuid().nullable().optional(),
  line: LineSchema.optional(),
  dt: z.string().nullable().optional(),
  sto: z.string().nullable().optional(),
  locationOrigId: z.string().uuid().nullable().optional(),
  locationOrig: LocationSchema.optional(),
  locationDestId: z.string().uuid().nullable().optional(),
  locationDest: LocationSchema.optional(),
  startPlanned: z.string().datetime().nullable().optional(),
  endPlanned: z.string().datetime().nullable().optional(),
  startActual: z.string().datetime().nullable().optional(),
  endActual: z.string().datetime().nullable().optional(),
  startEstimated: z.string().datetime().nullable().optional(),
  endEstimated: z.string().datetime().nullable().optional(),
  tripTypeId: z.string().uuid().nullable().optional(),
  tripType: TripTypeSchema.optional(),
  stopTypeId: z.string().uuid().nullable().optional(),
  stopType: StopTypeSchema.optional(),
  companyId: z.string().uuid().nullable().optional(),
  company: CompanySchema.optional(),
  justificationId: z.string().uuid().nullable().optional(),
  justification: JustificationSchema.optional(),
  justificationMessage: z.string().nullable().optional(),
  locationGroupId: z.string().uuid().nullable().optional(),
  dailyTripSections: z.array(DailyTripSectionSchema).nullable().optional(),
});

export const DailyTripRequestSchema = z.object({
  dailyTrip: DailyTripSchema,
  dailyTripSections: z.array(DailyTripSectionSchema).optional(),
});

export type DailyTripSchema = z.infer<typeof DailyTripSchema>;
export type DailyTripSection = z.infer<typeof DailyTripSectionSchema>;
export type DailyTripRequest = z.infer<typeof DailyTripRequestSchema>;

export function useDailyTripDetailsDialog() {
  const methods = useForm({
    defaultValues: {
      id: "",
      createAt: null,
      updateAt: null,
      userIdCreate: null,
      userIdUpdate: null,
      tripNumber: "",
      tripDate: "",
      fleetGroupId: null,
      fleetGroup: null,
      flgStatus: "",
      notes: null,
      lineId: null,
      line: null,
      dt: null,
      sto: null,
      locationOrigId: null,
      locationOrig: null,
      locationDestId: null,
      locationDest: null,
      startPlanned: null,
      endPlanned: null,
      startActual: null,
      endActual: null,
      startEstimated: null,
      endEstimated: null,
      tripTypeId: null,
      tripType: null,
      stopTypeId: null,
      stopType: null,
      companyId: null,
      company: null,
      justificationId: null,
      justification: null,
      justificationMessage: null,
      locationGroupId: null,
      dailyTripSections: [],
    },
  });
  const { reset } = methods;
  const [hash] = useHash();
  const match = (hash as string)?.match(/#dailyTrip-(.+)/);
  const dailyTripId = match?.[1];

  const { dailyTripDetails, dailyTripSections, isLoading, error } =
    useDailyTripDetails({
      dailyTripId,
    });

  const normalizeData = (
    data: DailyTrip,
    dataDailyTripSections: DailyTrip[],
  ) => {
    const dailyTripDefaultValues = {
      id: data.id,
      createAt: data.createAt,
      updateAt: data.updateAt,
      userIdCreate: data.userIdCreate,
      userIdUpdate: data.userIdUpdate,
      tripNumber: data.tripNumber,
      tripDate: data.tripDate ? dayjs(data.tripDate).format("YYYY-MM-DD") : "",
      fleetGroupId: data.fleetGroupId,
      fleetGroup: data.fleetGroup || null,
      flgStatus: data.flgStatus,
      notes: data.notes,
      lineId: data.lineId,
      line: data.line,
      dt: data.dt,
      sto: data.sto,
      locationOrigId: data.locationOrigId,
      locationOrig: data.locationOrig || null,
      locationDestId: data.locationDestId,
      locationDest: data.locationDest || null,
      startPlanned: data.startPlanned
        ? dayjs(data.startPlanned).format("YYYY-MM-DDTHH:mm")
        : null,
      endPlanned: data.endPlanned
        ? dayjs(data.endPlanned).format("YYYY-MM-DDTHH:mm")
        : null,
      startActual: data.startActual
        ? dayjs(data.startActual).format("YYYY-MM-DDTHH:mm")
        : null,
      endActual: data.endActual
        ? dayjs(data.endActual).format("YYYY-MM-DDTHH:mm")
        : null,
      startEstimated: data.startEstimated
        ? dayjs(data.startEstimated).format("YYYY-MM-DDTHH:mm")
        : null,
      endEstimated: data.endEstimated
        ? dayjs(data.endEstimated).format("YYYY-MM-DDTHH:mm")
        : null,
      tripTypeId: data.tripTypeId,
      tripType: data.tripType || null,
      stopTypeId: data.stopTypeId,
      stopType: data.stopType || null,
      companyId: data.companyId,
      company: data.company || null,
      justificationId: data.justificationId,
      justification: data.justification || null,
      justificationMessage: data.justificationMessage,
      locationGroupId: data.locationGroupId,
      dailyTripSections: dataDailyTripSections.map((section) => ({
        ...section,
        startPlanned: section.startPlanned
          ? dayjs(section.startPlanned).format("YYYY-MM-DDTHH:mm")
          : null,
        endPlanned: section.endPlanned
          ? dayjs(section.endPlanned).format("YYYY-MM-DDTHH:mm")
          : null,
        startEstimated: section.startEstimated
          ? dayjs(section.startEstimated).format("YYYY-MM-DDTHH:mm")
          : null,
        endEstimated: section.endEstimated
          ? dayjs(section.endEstimated).format("YYYY-MM-DDTHH:mm")
          : null,
        startActual: section.startActual
          ? dayjs(section.startActual).format("YYYY-MM-DDTHH:mm")
          : null,
        endActual: section.endActual
          ? dayjs(section.endActual).format("YYYY-MM-DDTHH:mm")
          : null,
      })),
    };
    return dailyTripDefaultValues;
  };

  useEffect(() => {
    if (dailyTripDetails && dailyTripSections) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore next line
      reset(normalizeData(dailyTripDetails, dailyTripSections));
    }
  }, [dailyTripDetails, dailyTripSections]);

  return {
    dailyTripDetails,
    isLoading,
    error,
    methods,
  };
}
