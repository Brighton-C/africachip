import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { createVehicle } from "@/lib/actions/vehicle";
import Link from "next/link";
import {
  eyebrowClass,
  adminTitleClass,
  sectionTitleClass,
  inputClass,
  primaryButtonClass,
} from "@/lib/ui";

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
    <div className="container-page pb-24 pt-12 md:pt-16">
      <Link
        href="/account"
        className={`${eyebrowClass} transition-opacity hover:opacity-60`}
      >
        ← Account
      </Link>
      <h1 className={adminTitleClass}>My vehicles</h1>

      <div className="mt-10 max-w-3xl border-t border-fog-200">
        {vehicles.length === 0 && (
          <p className="border-b border-fog-200 py-5 text-sm text-steel-500">
            No vehicles added yet.
          </p>
        )}
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className="border-b border-fog-200 py-5">
            <p className="font-display text-lg font-normal">
              {vehicle.make} {vehicle.model} ({vehicle.year})
            </p>
            {(vehicle.engine || vehicle.registration) && (
              <div className="mt-2 space-y-0.5 text-sm text-steel-500">
                {vehicle.engine && <p>Engine: {vehicle.engine}</p>}
                {vehicle.registration && (
                  <p>Registration: {vehicle.registration}</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-16 max-w-xl">
        <h2 className={sectionTitleClass}>Add a vehicle</h2>
        <form action={createVehicle} className="mt-8 space-y-4">
          <input
            name="make"
            placeholder="Make (e.g. Toyota)"
            required
            className={inputClass}
          />
          <input
            name="model"
            placeholder="Model (e.g. Hilux)"
            required
            className={inputClass}
          />
          <input
            name="year"
            type="number"
            placeholder="Year"
            required
            className={inputClass}
          />
          <input
            name="engine"
            placeholder="Engine (e.g. 2.8 Diesel)"
            className={inputClass}
          />
          <input
            name="registration"
            placeholder="Registration number"
            className={inputClass}
          />
          <textarea
            name="notes"
            placeholder="Additional information"
            rows={4}
            className={`${inputClass} resize-none`}
          />
          <button type="submit" className={primaryButtonClass}>
            Add vehicle
          </button>
        </form>
      </div>
    </div>
  );
}