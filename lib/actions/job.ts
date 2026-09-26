"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

const ADMIN_ROLES = ["superadmin", "owner", "dispatcher"];

export async function updateJob(formData: FormData) {
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

  const jobId = formData.get("jobId") as string;
  const ecuInformation = (formData.get("ecuInformation") as string) || null;
  const technicianNotes = (formData.get("technicianNotes") as string) || null;
  const status = formData.get("status") as string;

  await prisma.job.update({
    where: { id: jobId },
    data: {
      ecuInformation,
      technicianNotes,
      status: status as any,
      completedAt: status === "completed" ? new Date() : null,
    },
  });

  // Keep the booking's status in sync with the job's status
  const job = await prisma.job.findUnique({ where: { id: jobId } });
  await prisma.booking.update({
    where: { id: job!.bookingId },
    data: { status: status as any },
  });

  revalidatePath(`/admin/jobs/${jobId}`);
  revalidatePath("/admin/bookings");
}