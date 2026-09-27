import { Gauge, Settings2, Wrench, type LucideIcon } from "lucide-react";

export function getServiceCategory(name: string): {
  label: string;
  icon: LucideIcon;
} {
  const lower = name.toLowerCase();

  if (lower.includes("stage") || lower.includes("remap")) {
    return { label: "Performance", icon: Gauge };
  }

  if (
    lower.includes("dpf") ||
    lower.includes("adblue") ||
    lower.includes("emission")
  ) {
    return { label: "Emissions", icon: Settings2 };
  }

  if (lower.includes("diagnostic")) {
    return { label: "Diagnostics", icon: Settings2 };
  }

  return { label: "Vehicle Service", icon: Wrench };
}