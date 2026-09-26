"use server";

import { prisma } from "@/lib/prisma";

export async function createUserRecord(
  id: string,
  name: string,
  email: string,
  phone: string
) {
  await prisma.user.upsert({
    where: { id },
    update: {},
    create: {
      id,
      name,
      email,
      phone,
      role: "customer",
    },
  });
}