"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const OWNER_ROLES = ["superadmin", "owner"];

async function requireAdmin() {
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
}

export async function createService(formData: FormData) {
  await requireAdmin();

  const name = formData.get("name") as string;
  const description = (formData.get("description") as string) || null;
  const priceRaw = formData.get("price") as string;
  const price = priceRaw ? parseFloat(priceRaw) : null;

  await prisma.service.create({
    data: { name, description, price },
  });

  revalidatePath("/admin/services");
  redirect("/admin/services");
}

export async function updateService(formData: FormData) {
  await requireAdmin();

  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const description = (formData.get("description") as string) || null;
  const priceRaw = formData.get("price") as string;
  const price = priceRaw ? parseFloat(priceRaw) : null;

  await prisma.service.update({
    where: { id },
    data: { name, description, price },
  });

  revalidatePath("/admin/services");
  revalidatePath(`/admin/services/${id}`);
  redirect("/admin/services");
}

export async function deleteService(formData: FormData) {
  await requireAdmin();

  const id = formData.get("id") as string;

  try {
    await prisma.service.delete({ where: { id } });
  } catch {
    throw new Error(
      "Cannot delete this service — it has existing bookings. Consider renaming it instead."
    );
  }

  revalidatePath("/admin/services");
  redirect("/admin/services");
}