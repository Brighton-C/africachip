import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { createBooking } from "@/lib/actions/booking";
import { redirect } from "next/navigation";

export default async function NewBookingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const vehicles = await prisma.vehicle.findMany({
    where: { customerId: user!.id },
  });

  const services = await prisma.service.findMany({
    orderBy: { name: "asc" },
  });

  if (vehicles.length === 0) {
    redirect("/account/vehicles");
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-semibold mb-6">Request a Service</h1>

      <form action={createBooking} className="space-y-4">
        <select
          name="vehicleId"
          required
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Select vehicle</option>
          {vehicles.map((vehicle) => (
            <option key={vehicle.id} value={vehicle.id}>
              {vehicle.make} {vehicle.model} ({vehicle.year})
            </option>
          ))}
        </select>

        <select
          name="serviceId"
          required
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Select service</option>
          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name}
            </option>
          ))}
        </select>

        <input
          name="preferredDate"
          type="date"
          required
          className="w-full border rounded px-3 py-2"
        />

        <select
          name="locationType"
          required
          className="w-full border rounded px-3 py-2"
        >
          <option value="workshop">AfroChip workshop</option>
          <option value="customer">My location</option>
        </select>

        <input
          name="address"
          placeholder="Address (if requesting at your location)"
          className="w-full border rounded px-3 py-2"
        />

        <textarea
          name="notes"
          placeholder="Additional information"
          className="w-full border rounded px-3 py-2"
        />

        <button
          type="submit"
          className="bg-black text-white rounded px-6 py-2"
        >
          Submit Request
        </button>
      </form>
    </div>
  );
}