"use server";

import { redirect } from "next/navigation";
import { auth, signIn, signOut } from "./auth";
import { getBookings } from "./data-service";
import { supabase } from "./supabase";
import { revalidatePath } from "next/cache";

export async function signInAction() {
  await signIn("google", { redirectTo: "/account" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}

export async function updateProfileAction(formData: FormData) {
  const session = await auth();

  if (!session) throw new Error("You must be signed in to update your profile");

  const nationalID = formData.get("nationalID") as string;
  const [nationality, countryFlag] = formData
    .get("nationality")
    ?.toString()
    ?.split("%") as [string, string];

  const regex = /^[a-zA-Z0-9]{6,11}$/; // Regex explanation below
  if (!regex.test(nationalID)) {
    throw new Error("Invalid national ID number");
  }

  const { data, error } = await supabase
    .from("guests")
    .update({ nationalID, nationality, countryFlag })
    .eq("id", (session?.user as any)?.guestId);

  if (error) {
    console.error(error);
    throw new Error("Guest could not be updated");
  }

  revalidatePath("/account/profile");
}

export async function deleteReservationAction(bookingId: number) {
  const session = await auth();

  if (!session) throw new Error("You must be signed in");

  const guestBookings = await getBookings((session?.user as any)?.guestId);

  const guestBookingsIds = guestBookings.map((booking: any) => booking.id);

  if (!guestBookingsIds.includes(bookingId))
    throw new Error("You are not authorized to delete this booking");

  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", bookingId);

  if (error) throw new Error("Booking could not be deleted");

  revalidatePath("/account/reservations");
}

export async function updateBookingAction(formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("You must be signed in");

  const guestBookings = await getBookings((session?.user as any)?.guestId);

  const guestBookingsIds = guestBookings.map((booking: any) => booking.id);

  const bookingId = parseInt(formData.get("bookingId") as string, 10);

  if (!guestBookingsIds.includes(bookingId))
    throw new Error("You are not authorized to update this booking");

  const numGuests = formData.get("numGuests") as string;
  const observations = formData.get("observations")?.toString().slice(0, 1000);

  const { error } = await supabase
    .from("bookings")
    .update({ numGuests, observations })
    .eq("id", bookingId)
    .select()
    .single();

  if (error) {
    throw new Error("Booking could not be updated");
  }

  revalidatePath("/account/reservations");
  revalidatePath(`/account/reservations/edit/${bookingId}`);
  redirect("/account/reservations");
}

export async function createBookingAction(
  bookingData: any,
  formData: FormData
) {
  const session = await auth();
  if (!session) throw new Error("You must be signed in");

  const currentGuestBookings = await getBookings(
    (session?.user as any)?.guestId
  );

  if (currentGuestBookings.length === 10)
    throw new Error("You have reached the maximum number of bookings");

  const { numGuests, observations } = Object.fromEntries(formData.entries());

  const bookData = {
    ...bookingData,
    numGuests,
    observations: observations?.slice(0, 1000),
    extrasPrice: 0,
    totalPrice: bookingData.cabinPrice,
    status: "unconfirmed",
    hasBreakfast: false,
    isPaid: false,
    guestId: Number((session?.user as any)?.guestId),
  };

  const { error } = await supabase.from("bookings").insert([bookData]);

  if (error) {
    throw new Error("Booking could not be created");
  }

  revalidatePath(`cabins/${bookingData?.cabinId}`);

  redirect("/thankyou");
}
