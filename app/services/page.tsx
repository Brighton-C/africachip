import { prisma } from "@/lib/prisma";

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-semibold mb-2">Our Services</h1>
      <p className="text-gray-600 mb-8">
        Performed only where legally permitted for the vehicle's registration,
        use, and jurisdiction.
      </p>

      <div className="space-y-6">
        {services.map((service) => (
          <div key={service.id} className="border-b pb-6">
            <h2 className="text-lg font-medium">{service.name}</h2>
            <p className="text-gray-600 mt-1">{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}