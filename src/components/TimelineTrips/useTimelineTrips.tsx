import { useMemo } from "react";
import { useGiantt } from "@/hooks/useGiantt";
import {
  Circuit,
  CircuitJourney,
  DailyTripSection,
  DriverSchedule,
  Trip,
} from "@/interfaces/schedule";
import { Unit } from "react-calendar-timeline";
import dayjs from "dayjs";
import { match } from "ts-pattern";
import { useDriverSchedule } from "@/features/DriversSchedule/useDriversSchedule";
import { useToast } from "@/hooks/useToast";
import { useHash } from "@/hooks/useHash";
import { useJourneysByPeriod } from "@/hooks/useJourneysByPeriod";
import { useDailyTripsUnallocated } from "@/hooks/useDailyTripsUnallocated";
import { useDialog } from "@/hooks/useDialog/useDialog";
import { Box, Typography } from "@mui/material";
import { useCircuit } from "@/hooks/useCircuit";

function generateRandomID() {
  const timePart = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 15);
  return timePart + randomPart;
}

export function useTimelineTrips() {
  const {
    trips,
    drivers,
    circuits,
    mutate: mutateJourneysByPeriod,
  } = useJourneysByPeriod();
  const { createCircuit } = useCircuit();
  const [, setHash] = useHash();
  const { addToast } = useToast();
  const { openDialog } = useDialog();
  const { updateCircuit } = useDriverSchedule();
  const {
    visibleTimeEnd,
    visibleTimeStart,
    setVisibleTimeStart,
    setVisibleTimeEnd,
  } = useGiantt();

  const { addNewData, mutate: refetchJourneys } = useJourneysByPeriod();
  const {
    selectedDailyTrip,
    removeDailyTrip,
    mutate: mutateTripsUnallocated,
  } = useDailyTripsUnallocated();

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
    const isACircuit = circuits?.some(
      (circuit) => circuit.ciruictCode === itemId,
    );

    if (isACircuit) {
      const hash = `journeyDetails-${itemId}`;
      setHash(hash);
      return;
    }

    const currentTrip = trips?.find((trip) => trip.id === itemId);

    if (currentTrip?.circuitCode) {
      const hash = `journeyDetails-${currentTrip?.circuitCode}`;
      setHash(hash);
      return;
    }

    setHash(`activityDetails-${itemId}`);
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
    drivers?.forEach((driver: DriverSchedule, i: number) => {
      if (!groupsMap.has(driver?.driverId)) {
        groupsMap.set(driver.driverId, {
          id: driver.driverId,
          title: `${driver.driverName} - ${i}`,
        });
      }
    });

    circuits?.forEach((circuit: Circuit) => {
      itemsMap.set(circuit.ciruictCode, {
        id: circuit.ciruictCode,
        group: circuit.driverId,
        title: circuit.ciruictCode,
        start_time: dayjs(circuit.startDate, "YYYY-MM-DDTHH:mm:ss"),
        end_time: dayjs(circuit.endDate, "YYYY-MM-DDTHH:mm:ss"),
      });
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
  }, [trips, circuits, drivers]);

  const handleConfirmMoveItem = (newCircuit: Circuit, itemId: string) => {
    updateCircuit(newCircuit);
    const newCircuitJourney: CircuitJourney = {
      ciruictCode: itemId,
      driverId: newCircuit.driverId,
      nickName: newCircuit.driverName || "",
      startDate: newCircuit.startDate,
      endDate: newCircuit.endDate,
    };

    createCircuit(newCircuitJourney, {
      onSuccess: () => {
        addToast("Viagem movida com sucesso.", { type: "success" });
        refetchJourneys();
      },
      onError: () => {
        addToast("Erro ao mover viagem.", { type: "error" });
      },
    });
  };

  const handleMoveItem = (
    itemId: string,
    dragTime: number,
    newGroupOrder: number,
  ) => {
    if (!circuits) return;
    const newDriver = drivers?.[newGroupOrder];
    const driverName = drivers?.find(
      (driver: DriverSchedule) => driver.driverId === itemId,
    )?.driverName;

    const circuitIndex = circuits?.findIndex(
      (trip) => trip.ciruictCode === itemId,
    );
    if (circuitIndex !== undefined && circuitIndex >= 0) {
      let currentCircuit: Circuit = circuits[circuitIndex];
      if (driverName) {
        currentCircuit = {
          ...currentCircuit,
          driverName: driverName,
        };
      }

      const difference = dayjs(currentCircuit.endDate).diff(
        currentCircuit.startDate,
      );
      const newStartDate = dayjs(dragTime).format("YYYY-MM-DDTHH:mm:ss");
      const newEndDate = dayjs(newStartDate)
        .add(difference, "millisecond")
        .format("YYYY-MM-DDTHH:mm:ss");

      let newCircuit: Circuit;

      if (newDriver?.driverId === currentCircuit.driverId) {
        newCircuit = {
          ...currentCircuit,
          ciruictCode: itemId,
          startDate: newStartDate,
          endDate: newEndDate,
        };
        handleConfirmMove({
          onConfirm: () => handleConfirmMoveItem(newCircuit, itemId),
        });
      } else if (newDriver && newDriver?.driverId !== currentCircuit.driverId) {
        newCircuit = {
          ...currentCircuit,
          ciruictCode: itemId,
          driverId: newDriver.driverId,
          driverName: newDriver.driverName,
        };
        handleConfirmMove({
          onConfirm: () => handleConfirmMoveItem(newCircuit, itemId),
        });
      }
    }
  };

  const handleConfirmAllocate = (driverId: string) => {
    const currentDriver = drivers?.find(
      (driver) => driver.driverId === driverId,
    );
    if (!currentDriver || !selectedDailyTrip) return;
    const driverName = drivers?.find(
      (driver: DriverSchedule) => driver.driverId === driverId,
    )?.driverName;

    const newTrips = selectedDailyTrip.sectionsUnallocated.map(
      (section: DailyTripSection) => {
        const newTrip: Trip = {
          id: section.dailyTripSectionId,
          code: selectedDailyTrip.sto,
          startPlanned: section.startPlanned,
          endPlanned: section.endPlanned,
          driverId,
          driverName: currentDriver.driverName,
          locationOrigCode: section.locOrig,
          locationDestCode: section.locDest,
          tripType: "TRIP",
        };
        return newTrip;
      },
    );

    const newCircuit = {
      ciruictCode: generateRandomID(),
      driverId,
      driverName,
      startDate: dayjs(selectedDailyTrip.startPlanned)
        .subtract(1, "hour")
        .format("YYYY-MM-DDTHH:mm:ss"),
      endDate: dayjs(selectedDailyTrip.endPlanned)
        .add(30, "minutes")
        .format("YYYY-MM-DDTHH:mm:ss"),
      trips: newTrips,
    };

    addNewData({
      trips: newTrips,
      circuits: [newCircuit],
    });

    const newCircuitJourney: CircuitJourney = {
      driverId,
      nickName: currentDriver.driverName,
      startDate: newCircuit.startDate,
      endDate: newCircuit.endDate,
      tasksDriver: newTrips.map((trip: Trip, i) => ({
        seq: i,
        demand: trip.code,
        lineCode: trip.code,
        type: "V",
        activityId: trip.id,
        locOrig: trip.locationOrigCode,
        locDest: trip.locationDestCode,
        startPlanned: trip.startPlanned,
        endPlanned: trip.endPlanned,
        lineId: trip.id,
      })),
    };

    createCircuit(newCircuitJourney, {
      onSuccess: () => {
        addToast("Viagem alocada com sucesso.", { type: "success" });
        removeDailyTrip(selectedDailyTrip.dailyTripId);
        mutateTripsUnallocated();
        mutateJourneysByPeriod();
      },
      onError: () => {
        addToast("Erro ao alocar viagem.", { type: "error" });
        mutateTripsUnallocated();
        mutateJourneysByPeriod();
      },
    });
  };

  const handleCanvasClick = (driverId: string) => {
    const currentDriver = drivers?.find(
      (driver) => driver.driverId === driverId,
    );
    if (!currentDriver || !selectedDailyTrip) return;

    openDialog({
      title: "Alocar motorista",
      body: (
        <Box>
          <Typography>
            Deseja associar o motorista{" "}
            <strong>{currentDriver?.driverName}</strong> a todas as viagens
            desta rota?
          </Typography>
          <Box marginTop="10px">
            <Box display="flex" flexDirection="row" gap="3px">
              <Typography variant="caption" fontWeight="bold">
                Início da jornada:{" "}
              </Typography>
              <Typography variant="caption">
                {dayjs(selectedDailyTrip.startPlanned).format(
                  "DD/MM/YYYY [as] HH:mm",
                )}
              </Typography>
            </Box>
            <Box display="flex" flexDirection="row" gap="3px">
              <Typography variant="caption" fontWeight="bold">
                Fim da jornada:{" "}
              </Typography>
              <Typography variant="caption">
                {dayjs(selectedDailyTrip.endPlanned).format(
                  "DD/MM/YYYY [as] HH:mm",
                )}
              </Typography>
            </Box>
          </Box>
        </Box>
      ),
      onConfirm: () => handleConfirmAllocate(driverId),
    });
  };

  const handleConfirmMove = ({ onConfirm }: { onConfirm: () => void }) => {
    openDialog({
      title: "Alterar viagem",
      body: (
        <Box display="flex" flexDirection="column">
          <Typography>Tem certeza que deseja alterar essa viagem?</Typography>
          <Typography>
            Essa ação <strong>não poderá ser desfeita.</strong>
          </Typography>
        </Box>
      ),
      onConfirm,
    });
  };

  return {
    groups,
    items,
    visibleTimeStart,
    visibleTimeEnd,
    handleTimeChange,
    handleLabelFormatItem,
    handleLabelFormatHeader,
    handleDoubleClick,
    handleMoveItem,
    handleCanvasClick,
  };
}
