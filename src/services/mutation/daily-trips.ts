import { useMutation } from "@tanstack/react-query";
import api from "../configs/api";
import { queryClient } from "../configs/provider";
import dayjs from "dayjs";
import { DailyTrip } from "@/interfaces/daily-trip";

export const useDailyTripMutation = () => {
  return useMutation({
    mutationKey: ["daily-trips"],
    mutationFn: async (payload: DailyTrip) => {
      console.log(payload);
      const normalizedPayload = {
        dailyTrip: {
          tripNumber: payload.tripNumber || "0000",
          tripDate: payload.tripDate
            ? dayjs(payload.tripDate).format("YYYY-MM-DD")
            : "",
          fleetGroupId: payload.fleetGroupId,
          fleetGroup: null,
          flgStatus: payload.flgStatus || "N",
          notes: payload.notes,
          lineId: payload.lineId,
          line: payload.line,
          dt: payload.dt,
          sto: payload.sto,
          locationOrigId: payload.locationOrigId,
          locationOrig: null,
          locationDestId: payload.locationDestId,
          locationDest: null,
          startPlanned: payload.startPlanned
            ? dayjs(payload.startPlanned).format("YYYY-MM-DDTHH:mm")
            : null,
          endPlanned: payload.endPlanned
            ? dayjs(payload.endPlanned).format("YYYY-MM-DDTHH:mm")
            : null,
          tripTypeId: payload.tripTypeId,
          tripType: null,
          stopTypeId: payload.stopTypeId || null,
          stopType: null,
          companyId: payload.companyId || null,
          id: payload.id || "00000000-0000-0000-0000-000000000000",
        },
        dailyTripSections: payload.dailyTripSections.map((section) => ({
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
          driverId: section.driverId || null,
          locationOrigId: section.locationOrigId || null,
          locationDestId: section.locationDestId || null,
          truck: null,
          locationOrig: null,
          locationDest: null,
          stopType: null,
        })),
      };

      console.log(normalizedPayload);
      try {
        const response = await api.post("/DailyTrip/updatedailyTrip", {
          ...normalizedPayload,
        });
        console.log("response", response);
        return response.data;
      } catch (error) {
        console.error(error);
        return error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["daily-trips"],
      });
    },
  });
};

export interface DailyTripBatchChangePayload {
  dailyTripId: string[];
  actionType: string;
  justificationId: string;
  justificationMessage: string;
  companyId?: string;
  fleetGroupId?: string;
  deliveryDate?: string;
  deliveryTime?: string;
  requestDate?: string;
  keepDriver?: boolean;
}
export interface DailyTripBatchChangeResponse {}

export const useDailyTripBatchChange = () => {
  return useMutation({
    mutationKey: ["daily-trips-batch"],
    mutationFn: async (payload: DailyTripBatchChangePayload) => {
      console;
      try {
        const response = await api.post("/DailyTrip/dailytripbatchchange", {
          ...payload,
        });
        console.log("response", response);
        return response.data;
      } catch (error) {
        console.error(error);
        return error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["daily-trips"],
      });
    },
  });
};
