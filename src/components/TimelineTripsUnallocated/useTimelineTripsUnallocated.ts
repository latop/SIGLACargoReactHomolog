import { useMemo } from "react";
import { useGiantt } from "@/hooks/useGiantt";
import { DailyTripUnallocated, DailyTripSection } from "@/interfaces/schedule";
import { Unit } from "react-calendar-timeline";
import dayjs from "dayjs";
import { match } from "ts-pattern";
import { useHash } from "@/hooks/useHash";
import { useDailyTripsUnallocated } from "@/hooks/useDailyTripsUnallocated";
import { useRouter, useSearchParams } from "next/navigation";

export function useTimelineTripsUnallocated() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [, setHash] = useHash();
  const {
    visibleTimeEnd,
    visibleTimeStart,
    setVisibleTimeStart,
    setVisibleTimeEnd,
  } = useGiantt();

  const { selectedDailyTrip, selectDailyTrip, dailyTripsUnallocated } =
    useDailyTripsUnallocated();

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

  const handleDoubleClick = (itemId: string) => {
    const hash = `journeyDetails-${itemId}`;
    setHash(hash);
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
    dailyTripsUnallocated?.forEach((trip: DailyTripUnallocated) => {
      if (!groupsMap.has(trip.dailyTripId)) {
        groupsMap.set(trip.dailyTripId, {
          id: trip.dailyTripId,
          title: trip.sto,
        });
      }
    });

    dailyTripsUnallocated?.forEach((trip) => {
      trip?.sectionsUnallocated?.forEach((section: DailyTripSection) => {
        itemsMap.set(section.dailyTripSectionId, {
          id: section.dailyTripSectionId,
          group: section.dailyTripId,
          title: section.dailyTripSectionId,
          start_time: dayjs(section.startPlanned, "YYYY-MM-DDTHH:mm:ss"),
          end_time: dayjs(section.endPlanned, "YYYY-MM-DDTHH:mm:ss"),
        });
      });
    });

    return {
      groups: Array.from(groupsMap.values()),
      items: Array.from(itemsMap.values()),
    };
  }, [dailyTripsUnallocated]);

  const updateSearchParams = (newParams: Record<string, string>) => {
    const query = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, value]) => {
      if (searchParams.get(key)) {
        if (!value) {
          query.delete(key);
        } else {
          query.set(key, value);
        }
      } else {
        query.append(key, value);
      }
    });
    return query;
  };

  const handleGroupItemClick = (dailyTripId: string) => {
    const currentTrip = dailyTripsUnallocated?.find(
      (trip: DailyTripUnallocated) => trip.dailyTripId === dailyTripId,
    );
    if (!currentTrip) return;

    if (currentTrip.sto === searchParams.get("demandAvailable")) {
      const params = updateSearchParams({ demandAvailable: "" });
      router.push(`/drivers-schedule?${params.toString()}`);
      return;
    }
    const params = updateSearchParams({ demandAvailable: currentTrip.sto });
    router.push(`/drivers-schedule?${params.toString()}`);
  };

  const handleItemClick = (dailyTripId: string) => {
    selectDailyTrip(dailyTripId);
  };

  const handleDeselectItem = () => {
    selectDailyTrip(null);
  };

  return {
    groups,
    items,
    visibleTimeStart,
    visibleTimeEnd,
    handleTimeChange,
    handleLabelFormatItem,
    selectedDailyTrip,
    handleDeselectItem,
    handleLabelFormatHeader,
    handleDoubleClick,
    handleGroupItemClick,
    handleItemClick,
  };
}
