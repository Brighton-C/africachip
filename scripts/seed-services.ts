import "dotenv/config";
import { prisma } from "../lib/prisma";

const services = [
  { name: "ECU Remapping", description: "Custom ECU tuning for improved performance and efficiency." },
  { name: "Stage 1", description: "Entry-level performance tune, no hardware changes required." },
  { name: "Stage 2", description: "Advanced tune, typically paired with supporting hardware upgrades." },
  { name: "Diagnostics", description: "Full vehicle diagnostic scan and fault code reporting." },
  { name: "DPF Delete", description: "Diesel particulate filter removal. Performed only where legally permitted for the vehicle's registration, use, and jurisdiction." },
  { name: "AdBlue Delete", description: "AdBlue/SCR system removal. Performed only where legally permitted for the vehicle's registration, use, and jurisdiction." },
  { name: "Emission Control Services", description: "Emission system diagnostics and modification. Performed only where legally permitted for the vehicle's registration, use, and jurisdiction." },
  { name: "Other Services", description: "Contact us for services not listed here." },
];

async function main() {
  for (const service of services) {
    await prisma.service.upsert({
      where: { name: service.name },
      update: {},
      create: service,
    });
  }
  console.log(`Seeded ${services.length} services.`);
}

main()
  .catch((e) => console.error("Failed:", e))
  .finally(() => prisma.$disconnect());