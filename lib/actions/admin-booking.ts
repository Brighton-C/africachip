"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

const ADMIN_ROLES = ["superadmin", "owner", "dispatcher"];

export async function updateBookingStatus(bookingId: string, status: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated.");

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true },
  });

  if (!dbUser || !ADMIN_ROLES.includes(dbUser.role)) {
    throw new Error("Not authorized.");
  }

  await prisma.booking.update({
    where: { id: bookingId },
    data: { status: status as any },
  });

  // Auto-create the internal job record once a booking is confirmed
  if (status === "confirmed") {
    await prisma.job.upsert({
      where: { bookingId },
      update: {},
      create: {
        bookingId,
        status: "confirmed",
      },
    });
  }

  revalidatePath("/admin/bookings");
}