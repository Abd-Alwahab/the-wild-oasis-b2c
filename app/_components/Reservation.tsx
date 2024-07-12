import { Tables } from "@/database.types";
import { getBookedDatesByCabinId, getSettings } from "../_lib/data-service";
import DateSelector from "./DateSelector";
import ReservationForm from "./ReservationForm";

type Props = {
  cabin: Tables<"cabins">;
};
async function Reservation({ cabin }: Props) {
  const [bookedDates, settings] = await Promise.all([
    getBookedDatesByCabinId(cabin.id),
    getSettings(),
  ]);
  return (
    <div className="grid grid-cols-2 border border-primary-900">
      <DateSelector
        cabin={cabin}
        bookedDates={bookedDates}
        settings={settings}
      />
      <ReservationForm cabin={cabin} />
    </div>
  );
}

export default Reservation;
