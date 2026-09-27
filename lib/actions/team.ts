"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const OWNER_ROLES = ["superadmin", "owner"];
const HIGH_PRIVILEGE_ROLES = ["superadmin", "owner"];

async function requireOwner() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated.");

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true },
  });

  if (!dbUser || !OWNER_ROLES.includes(dbUser.role)) {
    throw new Error("Not authorized.");
  }

  return { authUserId: user.id, viewerRole: dbUser.role };
}

function generateTempPassword() {
  return "afc-" + Math.random().toString(36).slice(2, 10);
}

export async function createStaffAccount(formData: FormData) {
  const { viewerRole } = await requireOwner();

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const requestedRole = formData.get("role") as string | null;

  // The server decides which roles this caller may grant, regardless of
  // what the form actually submitted.
  const allowedRoles =
    viewerRole === "superadmin"
      ? ["dispatcher", "owner", "superadmin"]
      : ["dispatcher"];

  const role =
    requestedRole && allowedRoles.includes(requestedRole)
      ? requestedRole
      : "dispatcher";

  const tempPassword = generateTempPassword();
  const admin = createAdminClient();

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password: tempPassword,
    email_confirm: true,
  });

  if (error || !data.user) {
    throw new Error(
      `Could not create account: ${error?.message ?? "unknown error"}`
    );
  }

  await prisma.user.create({
    data: {
      id: data.user.id,
      name,
      email,
      phone: "",
      role: role as any,
    },
  });

  revalidatePath("/admin/team");
  redirect(
    `/admin/team?created=${encodeURIComponent(email)}&temp=${encodeURIComponent(tempPassword)}`
  );
}

export async function updateUserRole(userId: string, role: string) {
  const { authUserId, viewerRole } = await requireOwner();

  if (viewerRole !== "superadmin") {
    throw new Error("Only superadmin can change roles.");
  }

  if (userId === authUserId) {
    throw new Error("You cannot change your own role.");
  }

  await prisma.user.update({
    where: { id: userId },
    data: { role: role as any },
  });

  revalidatePath("/admin/team");
}

export async function setAccountActive(formData: FormData) {
  const { authUserId, viewerRole } = await requireOwner();

  const targetId = formData.get("userId") as string;
  const active = formData.get("active") === "true";

  if (targetId === authUserId) {
    throw new Error("You cannot deactivate your own account.");
  }

  const targetUser = await prisma.user.findUnique({
    where: { id: targetId },
    select: { role: true },
  });

  if (!targetUser) throw new Error("User not found.");

  const targetIsHighPrivilege = HIGH_PRIVILEGE_ROLES.includes(
    targetUser.role
  );

  if (targetIsHighPrivilege && viewerRole !== "superadmin") {
    throw new Error(
      "Only superadmin can deactivate an owner or superadmin account."
    );
  }

  await prisma.user.update({
    where: { id: targetId },
    data: { active },
  });

  revalidatePath("/admin/team");
}