"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { notifyAdminsOfBooking, notifyAdminsOfBookingWhatsApp } from "@/lib/notifications";

export async function createBooking(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const vehicleId = formData.get("vehicleId") as string;
  const serviceId = formData.get("serviceId") as string;
  const locationType = formData.get("locationType") as "workshop" | "customer";
  const address = (formData.get("address") as string) || null;
  const preferredDate = formData.get("preferredDate") as string;
  const notes = (formData.get("notes") as string) || null;

  // Confirm the vehicle actually belongs to this user before booking against it
  const vehicle = await prisma.vehicle.findFirst({
    where: { id: vehicleId, customerId: user.id },
  });

  if (!vehicle) {
    throw new Error("Vehicle not found or does not belong to you.");
  }

  await prisma.booking.create({
    data: {
      customerId: user.id,
      vehicleId,
      serviceId,
      locationType,
      address,
      preferredDate: new Date(preferredDate),
      notes,
    },
  });

  const service = await prisma.service.findUnique({ where: { id: serviceId } });

const details = {
  serviceName: service!.name,
  vehicleLabel: `${vehicle.make} ${vehicle.model} (${vehicle.year})`,
  preferredDate: new Date(preferredDate).toLocaleDateString(),
  location:
    locationType === "workshop"
      ? "Workshop"
      : `Customer location${address ? `: ${address}` : ""}`,
};

await notifyAdminsOfBooking(details);
await notifyAdminsOfBookingWhatsApp(details);

  revalidatePath("/account/bookings");
  redirect("/account/bookings");
}