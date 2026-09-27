import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { createBooking } from "@/lib/actions/booking";
import { redirect } from "next/navigation";
import Link from "next/link";

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
    <div className="max-w-2xl mx-auto px-4 py-10">
      <Link href="/account" className="text-sm text-steel-500 hover:text-navy-950">
        ← Account
      </Link>

      <h1 className="font-display font-bold text-2xl mt-3 mb-6">
        Request a Service
      </h1>

      <div className="bg-white rounded-2xl border border-steel-500/10 p-6">
        <form action={createBooking} className="space-y-4">
          <select
            name="vehicleId"
            required
            className="w-full border border-steel-500/20 rounded px-3 py-2 text-sm"
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
            className="w-full border border-steel-500/20 rounded px-3 py-2 text-sm"
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
            className="w-full border border-steel-500/20 rounded px-3 py-2 text-sm"
          />

          <select
            name="locationType"
            required
            className="w-full border border-steel-500/20 rounded px-3 py-2 text-sm"
          >
            <option value="workshop">AfricaChip workshop</option>
            <option value="customer">My location</option>
          </select>

          <input
            name="address"
            placeholder="Address (if requesting at your location)"
            className="w-full border border-steel-500/20 rounded px-3 py-2 text-sm"
          />

          <textarea
            name="notes"
            placeholder="Additional information"
            className="w-full border border-steel-500/20 rounded px-3 py-2 text-sm"
          />

          <button
            type="submit"
            className="bg-orange-500 text-white rounded px-6 py-2 text-sm font-medium hover:bg-orange-500/90"
          >
            Submit Request
          </button>
        </form>
      </div>
    </div>
  );
}