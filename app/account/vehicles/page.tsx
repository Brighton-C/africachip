import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { createVehicle } from "@/lib/actions/vehicle";
import Link from "next/link";

export default async function VehiclesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const vehicles = await prisma.vehicle.findMany({
    where: { customerId: user!.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <Link href="/account" className="text-sm text-steel-500 hover:text-navy-950">
        ← Account
      </Link>

      <h1 className="font-display font-bold text-2xl mt-3 mb-6">
        My Vehicles
      </h1>

      <div className="space-y-3 mb-10">
        {vehicles.length === 0 && (
          <div className="bg-white rounded-2xl border border-steel-500/10 p-6 text-center">
            <p className="text-sm text-steel-500">No vehicles added yet.</p>
          </div>
        )}
        {vehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            className="bg-white rounded-2xl border border-steel-500/10 p-5 shadow-sm"
          >
            <p className="font-display font-semibold">
              {vehicle.make} {vehicle.model} ({vehicle.year})
            </p>
            <div className="text-sm text-steel-500 mt-1 space-y-0.5">
              {vehicle.engine && <p>Engine: {vehicle.engine}</p>}
              {vehicle.registration && (
                <p>Registration: {vehicle.registration}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-steel-500/10 p-6">
        <h2 className="font-display font-semibold text-lg mb-4">
          Add a vehicle
        </h2>
        <form action={createVehicle} className="space-y-4">
          <input
            name="make"
            placeholder="Make (e.g. Toyota)"
            required
            className="w-full border border-steel-500/20 rounded px-3 py-2 text-sm"
          />
          <input
            name="model"
            placeholder="Model (e.g. Hilux)"
            required
            className="w-full border border-steel-500/20 rounded px-3 py-2 text-sm"
          />
          <input
            name="year"
            type="number"
            placeholder="Year"
            required
            className="w-full border border-steel-500/20 rounded px-3 py-2 text-sm"
          />
          <input
            name="engine"
            placeholder="Engine (e.g. 2.8 Diesel)"
            className="w-full border border-steel-500/20 rounded px-3 py-2 text-sm"
          />
          <input
            name="registration"
            placeholder="Registration number"
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
            Add Vehicle
          </button>
        </form>
      </div>
    </div>
  );
}