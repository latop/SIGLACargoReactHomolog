import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import dayjs from "dayjs";
import { useSearchParams } from "next/navigation"; // Supondo que você esteja usando react-router v6

// Definição do enum Zoom
enum Zoom {
  MiddleDay = "0.5",
  OneDay = "1",
  ThreeDays = "3",
  SevenDays = "7",
}

// Contexto e tipo para o estado e setters que serão expostos pelo provider
type GianttContextType = {
  visibleTimeStart: Date;
  setVisibleTimeStart: (date: Date) => void;
  visibleTimeEnd: Date;
  setVisibleTimeEnd: (date: Date) => void;
  startDate: string | null;
};

// Criação do contexto com um valor padrão
const GianttContext = createContext<GianttContextType | undefined>(undefined);

// Funções para manipular datas
const setEndDate = (startDate: string | null, zoom: Zoom) => {
  return dayjs(startDate).add(Number(zoom), "day").toDate();
};

const setStartDate = (startDate: string | null) => {
  return dayjs(startDate).toDate();
};

// Provider
export const GianttProvider = ({ children }: { children: ReactNode }) => {
  const params = useSearchParams();
  const startDate = params.get("startDate");

  const [visibleTimeStart, setVisibleTimeStart] = useState<Date>(
    setStartDate(startDate),
  );
  const [visibleTimeEnd, setVisibleTimeEnd] = useState<Date>(
    setEndDate(startDate, Zoom.ThreeDays),
  );

  useEffect(() => {
    setVisibleTimeStart(setStartDate(startDate));
    setVisibleTimeEnd(setEndDate(startDate, Zoom.ThreeDays));
  }, [startDate]);

  return (
    <GianttContext.Provider
      value={{
        visibleTimeStart,
        setVisibleTimeStart,
        visibleTimeEnd,
        setVisibleTimeEnd,
        startDate,
      }}
    >
      {children}
    </GianttContext.Provider>
  );
};

// Hook para facilitar o uso do contexto
export const useGiantt = () => {
  const context = useContext(GianttContext);
  if (context === undefined) {
    throw new Error("useGianttContext must be used within a GianttProvider");
  }
  return context;
};
