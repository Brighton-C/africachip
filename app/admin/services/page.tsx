import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { createService } from "@/lib/actions/admin-service";

export default async function AdminServicesPage() {
  const services = await prisma.service.findMany({
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="font-display font-bold text-2xl mb-6">Services</h1>

      <div className="space-y-3 mb-12">
        {services.map((service) => (
          <Link
            key={service.id}
            href={`/admin/services/${service.id}`}
            className="flex justify-between items-center border border-steel-500/10 rounded-xl p-4 hover:shadow-sm transition-shadow bg-white"
          >
            <div>
              <p className="font-display font-semibold">{service.name}</p>
              <p className="text-sm text-steel-500">{service.description}</p>
            </div>
            <div className="text-sm text-steel-500">
              {service.price ? `$${service.price.toString()}` : "No price set"}
            </div>
          </Link>
        ))}
      </div>

      <h2 className="font-display font-semibold text-lg mb-4">
        Add a service
      </h2>
      <form
        action={createService}
        className="space-y-4 bg-white border border-steel-500/10 rounded-xl p-6"
      >
        <input
          name="name"
          placeholder="Service name"
          required
          className="w-full border border-steel-500/20 rounded px-3 py-2 text-sm"
        />
        <textarea
          name="description"
          placeholder="Description"
          className="w-full border border-steel-500/20 rounded px-3 py-2 text-sm"
        />
        <input
          name="price"
          type="number"
          step="0.01"
          placeholder="Price (optional)"
          className="w-full border border-steel-500/20 rounded px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="bg-orange-500 text-white rounded px-6 py-2 text-sm font-medium hover:bg-orange-500/90"
        >
          Add Service
        </button>
      </form>
    </div>
  );
}