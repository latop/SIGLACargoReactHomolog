import React from "react";
import dayjs from "dayjs";
import { useGiantt } from "@/hooks/useGiantt";

enum Zoom {
  MiddleDay = "0.5",
  OneDay = "1",
  ThreeDays = "3",
  SevenDays = "7",
  FourteenDays = "14",
}

const setEndDate = (startDate: Date | null, zoom: Zoom) => {
  if (Number(zoom) < 1) {
    return dayjs(startDate)
      .add(Number(zoom) * 24, "hour")
      .toDate();
  }
  return dayjs(startDate).add(Number(zoom), "day").toDate();
};

const setStartDate = (startDate: Date | null) => {
  return dayjs(startDate).toDate();
};

export function useGianttZoom() {
  const [currentZoom, setCurrentZoom] = React.useState<Zoom>(Zoom.ThreeDays);
  const {
    visibleTimeEnd,
    visibleTimeStart,
    setVisibleTimeEnd,
    setVisibleTimeStart,
  } = useGiantt();

  const handleChangeZoom = (
    event: React.MouseEvent<HTMLElement>,
    newZoom: Zoom,
  ) => {
    if (newZoom) {
      setCurrentZoom(newZoom);
      setVisibleTimeStart(setStartDate(visibleTimeStart));
      setVisibleTimeEnd(setEndDate(visibleTimeStart, newZoom as Zoom));
    }
  };

  return {
    visibleTimeStart,
    visibleTimeEnd,
    handleChangeZoom,
    zoom: currentZoom,
  };
}
