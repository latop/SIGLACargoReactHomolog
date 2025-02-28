import { useMemo } from "react";
import { useGiantt } from "@/hooks/useGiantt";
import { Trip, Truck } from "@/interfaces/schedule";
import { Unit } from "react-calendar-timeline";
import dayjs from "dayjs";
import { match } from "ts-pattern";
import { useDailyTripsByPeriod } from "@/hooks/useDailyTripsByPeriod";
import { useHash } from "@/hooks/useHash";

export function useTimelineDailyTrips() {
  const [, setHash] = useHash();
  const { trips, trucks } = useDailyTripsByPeriod();
  const {
    visibleTimeEnd,
    visibleTimeStart,
    setVisibleTimeStart,
    setVisibleTimeEnd,
  } = useGiantt();

  const handleLabelFormatItem = (
    [startTime]: [Date],
    unit: Unit,
    labelWidth: number,
  ) => {
    const options = match<Unit, Intl.DateTimeFormatOptions>(unit)
      .with("hour", () => ({ hour: "numeric" }))
      .with("day", () =>
        labelWidth < 100
          ? { day: "numeric" }
          : {
              weekday: "short",
              year: "numeric",
              month: "short",
              day: "numeric",
            },
      )
      .with("month", () => ({ year: "numeric", month: "short" }))
      .with("minute", () => ({ minute: "numeric" }))
      .otherwise(() => ({
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      }));

    const formatPtBR = new Intl.DateTimeFormat("pt-BR", options);
    return formatPtBR.format(startTime);
  };

  const handleLabelFormatHeader = ([startTime]: Date[], unit: Unit) => {
    const options = match<Unit, Intl.DateTimeFormatOptions>(unit)
      .with("year", () => ({ year: "numeric" }))
      .with("day", () => ({
        weekday: "short",
        year: "numeric",
        month: "long",
        day: "numeric",
      }))
      .otherwise(() => ({ year: "numeric", month: "long" }));

    const formatPtBR = new Intl.DateTimeFormat("pt-BR", options);
    return formatPtBR.format(startTime);
  };

  const handleTimeChange = (
    visibleTimeStart: number,
    visibleTimeEnd: number,
  ) => {
    const start = dayjs(visibleTimeStart).toDate();
    const end = dayjs(visibleTimeEnd).toDate();
    setVisibleTimeStart(start);
    setVisibleTimeEnd(end);
  };

  const { groups, items } = useMemo(() => {
    const groupsMap = new Map();
    const itemsMap = new Map();
    trucks?.forEach((truck: Truck) => {
      if (!groupsMap.has(truck?.truckId)) {
        groupsMap.set(truck.truckId, {
          id: truck.truckId,
          title: truck.licensePlate,
        });
      }
    });

    trips?.forEach((trip: Trip) => {
      itemsMap.set(trip.id, {
        id: trip.id,
        group: trip.driverId,
        title: trip.id,
        start_time: dayjs(trip.startPlanned, "YYYY-MM-DDTHH:mm:ss"),
        end_time: dayjs(trip.endPlanned, "YYYY-MM-DDTHH:mm:ss"),
      });
    });

    return {
      groups: Array.from(groupsMap.values()),
      items: Array.from(itemsMap.values()),
    };
  }, [trips, trucks]);

  const handleDoubleClick = (itemId: string) => {
    setHash(`#dailyTrip-${itemId}`);
  };

  return {
    groups,
    items,
    visibleTimeStart,
    visibleTimeEnd,
    handleTimeChange,
    handleLabelFormatItem,
    handleDoubleClick,
    handleLabelFormatHeader,
  };
}
