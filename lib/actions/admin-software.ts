"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const OWNER_ROLES = ["superadmin", "owner"];

async function requireOwner() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated.");

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true, active: true },
  });

  if (!dbUser || !dbUser.active || !OWNER_ROLES.includes(dbUser.role)) {
    throw new Error("Not authorized.");
  }
}

function readFields(formData: FormData) {
  const name = ((formData.get("name") as string) || "").trim();
  const description =
    ((formData.get("description") as string) || "").trim() || null;
  const priceRaw = formData.get("price") as string;
  const price = priceRaw ? parseFloat(priceRaw) : null;
  return { name, description, price };
}

function refresh() {
  revalidatePath("/software");
  revalidatePath("/admin/software");
}

export async function createSoftware(formData: FormData) {
  await requireOwner();
  const { name, description, price } = readFields(formData);

  await prisma.software.create({ data: { name, description, price } });

  refresh();
  redirect("/admin/software");
}

export async function updateSoftware(formData: FormData) {
  await requireOwner();
  const id = formData.get("id") as string;
  const { name, description, price } = readFields(formData);
  const active = formData.get("active") === "on";

  await prisma.software.update({
    where: { id },
    data: { name, description, price, active },
  });

  refresh();
  redirect("/admin/software");
}

export async function deleteSoftware(formData: FormData) {
  await requireOwner();
  const id = formData.get("id") as string;

  await prisma.software.delete({ where: { id } });

  refresh();
  redirect("/admin/software");
}