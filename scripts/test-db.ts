import "dotenv/config";
import { prisma } from "../lib/prisma";

async function main() {
  const services = await prisma.service.findMany();
  console.log("Connected. Services found:", services.length);
}

main()
  .catch((e) => console.error("Failed:", e))
  .finally(() => prisma.$disconnect());