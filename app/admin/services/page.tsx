import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { createService } from "@/lib/actions/admin-service";
import {
  eyebrowClass,
  adminTitleClass,
  sectionTitleClass,
  inputClass,
  primaryButtonClass,
} from "@/lib/ui";

export default async function AdminServicesPage() {
  const services = await prisma.service.findMany({
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="container-page pb-24 pt-12 md:pt-16">
      <p className={eyebrowClass}>Admin</p>
      <h1 className={adminTitleClass}>Services</h1>

      <div className="mt-10 max-w-3xl border-t border-fog-200">
        {services.map((service) => (
          <Link
            key={service.id}
            href={`/admin/services/${service.id}`}
            className="flex items-center justify-between gap-6 border-b border-fog-200 py-5 transition-opacity hover:opacity-60"
          >
            <div>
              <p className="font-display text-lg font-normal">{service.name}</p>
              <p className="mt-1 text-sm text-steel-500">
                {service.description}
              </p>
            </div>
            <div className="shrink-0 text-sm text-steel-500">
              {service.price ? `$${service.price.toString()}` : "No price set"}
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-16 max-w-xl">
        <h2 className={sectionTitleClass}>Add a service</h2>
        <form action={createService} className="mt-8 space-y-4">
          <input
            name="name"
            placeholder="Service name"
            required
            className={inputClass}
          />
          <textarea
            name="description"
            placeholder="Description"
            rows={4}
            className={`${inputClass} resize-none`}
          />
          <input
            name="price"
            type="number"
            step="0.01"
            placeholder="Price (optional)"
            className={inputClass}
          />
          <button type="submit" className={primaryButtonClass}>
            Add service
          </button>
        </form>
      </div>
    </div>
  );
}