import { Tables } from "@/database.types";
import { getCabins } from "../_lib/data-service";
import CabinCard from "./CabinCard";

export async function CabinList({ filter }: { filter: string }) {
  const cabins: Array<Tables<"cabins">> = await getCabins();

  if (!cabins?.length) return null;

  let displayCabins = cabins;
  if (filter === "all") displayCabins = cabins;
  if (filter === "small")
    displayCabins = cabins.filter((cabin) => (cabin.maxCapacity ?? 0) <= 3);
  if (filter === "medium")
    displayCabins = cabins.filter(
      (cabin) => (cabin.maxCapacity ?? 0) >= 4 && (cabin.maxCapacity ?? 0) <= 7
    );
  if (filter === "large")
    displayCabins = cabins.filter((cabin) => (cabin.maxCapacity ?? 0) <= 8);

  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 xl:gap-14">
      {displayCabins.map((cabin) => (
        <CabinCard cabin={cabin} key={cabin.id} />
      ))}
    </div>
  );
}
