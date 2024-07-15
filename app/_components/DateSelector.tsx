"use client";

import { Tables } from "@/database.types";
import {
  differenceInDays,
  isPast,
  isSameDay,
  isWithinInterval,
} from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import {
  ReservationRange,
  useReservation,
} from "../context/ReservationContext";

function isAlreadyBooked(range?: ReservationRange, datesArr?: any[]) {
  if (!range || !range.to || !range.from || !datesArr) return false;
  return (
    range.from &&
    range.to &&
    datesArr.some((date) =>
      isWithinInterval(date, { start: range.from, end: range.to })
    )
  );
}

type Props = {
  bookedDates: Date[];
  settings: Tables<"settings">;
  cabin: Tables<"cabins">;
};

function DateSelector({ bookedDates, settings, cabin }: Props) {
  const { range, setRange, resetRange } = useReservation();

  const displayRange = isAlreadyBooked(range, bookedDates)
    ? { from: undefined, to: undefined }
    : range;

  const { regularPrice, discount } = cabin;
  const numNights = differenceInDays(
    displayRange?.to ?? "",
    displayRange?.from ?? ""
  );
  const cabinPrice = numNights * ((regularPrice ?? 0) - (discount ?? 0));

  // SETTINGS
  const { minBookingLength, maxBookingLength } = settings;

  return (
    <div className="flex flex-col justify-between">
      <DayPicker
        className="pt-12 place-self-center"
        mode="range"
        onSelect={(range) => setRange({ from: range?.from, to: range?.to })}
        selected={displayRange}
        min={(minBookingLength ?? 0) + 1}
        max={maxBookingLength ?? 0}
        fromMonth={new Date()}
        fromDate={new Date()}
        toYear={new Date().getFullYear() + 5}
        captionLayout="dropdown"
        numberOfMonths={2}
        disabled={(currDate) =>
          isPast(currDate) ||
          bookedDates.some((date) => isSameDay(date, currDate))
        }
      />

      <div className="flex items-center justify-between px-8 bg-accent-500 text-primary-800 h-[72px]">
        <div className="flex items-baseline gap-6">
          <p className="flex gap-2 items-baseline">
            {(discount ?? 0) > 0 ? (
              <>
                <span className="text-2xl">
                  ${(regularPrice ?? 0) - (discount ?? 0)}
                </span>
                <span className="line-through font-semibold text-primary-700">
                  ${regularPrice}
                </span>
              </>
            ) : (
              <span className="text-2xl">${regularPrice}</span>
            )}
            <span className="">/night</span>
          </p>
          {numNights ? (
            <>
              <p className="bg-accent-600 px-3 py-2 text-2xl">
                <span>&times;</span> <span>{numNights}</span>
              </p>
              <p>
                <span className="text-lg font-bold uppercase">Total</span>{" "}
                <span className="text-2xl font-semibold">${cabinPrice}</span>
              </p>
            </>
          ) : null}
        </div>

        {range.from || range.to ? (
          <button
            className="border border-primary-800 py-2 px-4 text-sm font-semibold"
            onClick={resetRange}
          >
            Clear
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default DateSelector;
