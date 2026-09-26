import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { createVehicle } from "@/lib/actions/vehicle";

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
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-semibold mb-6">My Vehicles</h1>

      <div className="space-y-4 mb-10">
        {vehicles.length === 0 && (
          <p className="text-gray-600">No vehicles added yet.</p>
        )}
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className="border rounded p-4">
            <p className="font-medium">
              {vehicle.make} {vehicle.model} ({vehicle.year})
            </p>
            {vehicle.engine && (
              <p className="text-sm text-gray-600">Engine: {vehicle.engine}</p>
            )}
            {vehicle.registration && (
              <p className="text-sm text-gray-600">
                Registration: {vehicle.registration}
              </p>
            )}
          </div>
        ))}
      </div>

      <h2 className="text-lg font-semibold mb-4">Add a vehicle</h2>
      <form action={createVehicle} className="space-y-4">
        <input
          name="make"
          placeholder="Make (e.g. Toyota)"
          required
          className="w-full border rounded px-3 py-2"
        />
        <input
          name="model"
          placeholder="Model (e.g. Hilux)"
          required
          className="w-full border rounded px-3 py-2"
        />
        <input
          name="year"
          type="number"
          placeholder="Year"
          required
          className="w-full border rounded px-3 py-2"
        />
        <input
          name="engine"
          placeholder="Engine (e.g. 2.8 Diesel)"
          className="w-full border rounded px-3 py-2"
        />
        <input
          name="registration"
          placeholder="Registration number"
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
          Add Vehicle
        </button>
      </form>
    </div>
  );
}