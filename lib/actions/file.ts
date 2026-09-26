"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

const ADMIN_ROLES = ["superadmin", "owner", "dispatcher"];
const BUCKET = "ecu-files";

export async function uploadJobFile(formData: FormData) {
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
  const type = formData.get("type") as string;
  const file = formData.get("file") as File;

  if (!file || file.size === 0) throw new Error("No file selected.");

  const admin = createAdminClient();
  const path = `jobs/${jobId}/${type}-${Date.now()}-${file.name}`;

  const arrayBuffer = await file.arrayBuffer();
  const { error } = await admin.storage.from(BUCKET).upload(path, arrayBuffer, {
    contentType: file.type,
  });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  await prisma.file.create({
    data: {
      jobId,
      type: type as any,
      filename: file.name,
      storagePath: path,
    },
  });

  revalidatePath(`/admin/jobs/${jobId}`);
}

export async function getSignedFileUrl(storagePath: string) {
  const admin = createAdminClient();
  const { data, error } = await admin.storage
    .from(BUCKET)
    .createSignedUrl(storagePath, 60 * 5); // valid 5 minutes

  if (error || !data) return null;
  return data.signedUrl;
}