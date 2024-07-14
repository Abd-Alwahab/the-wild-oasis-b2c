"use server";

import { auth, signIn, signOut } from "./auth";
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
