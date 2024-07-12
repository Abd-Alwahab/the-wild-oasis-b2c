"use client";

import { createContext, ReactNode, useContext, useState } from "react";

export interface ReservationRange {
  from: Date | undefined;
  to: Date | undefined;
}

const ReservationContext = createContext<{
  range: ReservationRange;
  setRange: React.Dispatch<React.SetStateAction<ReservationRange>>;
  resetRange: () => void;
}>({
  range: { from: undefined, to: undefined },
  setRange: () => {},
  resetRange: () => {},
});

function ReservationProvider({ children }: { children: ReactNode }) {
  const [range, setRange] = useState<ReservationRange>({
    from: undefined,
    to: undefined,
  });

  const resetRange = () => setRange({ from: undefined, to: undefined });

  return (
    <ReservationContext.Provider value={{ range, setRange, resetRange }}>
      {children}
    </ReservationContext.Provider>
  );
}

function useReservation() {
  const context = useContext(ReservationContext);

  if (!context) {
    throw new Error("useReservation must be used within a ReservationProvider");
  }

  return context;
}

export { ReservationProvider, useReservation };
