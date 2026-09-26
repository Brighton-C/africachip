"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createVehicle(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const make = formData.get("make") as string;
  const model = formData.get("model") as string;
  const year = parseInt(formData.get("year") as string, 10);
  const engine = (formData.get("engine") as string) || null;
  const registration = (formData.get("registration") as string) || null;
  const notes = (formData.get("notes") as string) || null;

  await prisma.vehicle.create({
    data: {
      customerId: user.id,
      make,
      model,
      year,
      engine,
      registration,
      notes,
    },
  });

  revalidatePath("/account/vehicles");
  redirect("/account/vehicles");
}