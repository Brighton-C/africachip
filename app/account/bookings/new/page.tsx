import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { createBooking } from "@/lib/actions/booking";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  eyebrowClass,
  adminTitleClass,
  labelClass,
  inputClass,
  primaryButtonClass,
} from "@/lib/ui";

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
    <div className="container-page pb-24 pt-12 md:pt-16">
      <Link
        href="/account"
        className={`${eyebrowClass} transition-opacity hover:opacity-60`}
      >
        ← Account
      </Link>
      <h1 className={adminTitleClass}>Request a service</h1>

      <div className="mt-10 max-w-xl border-t border-fog-200 pt-10">
        <form action={createBooking} className="space-y-5">
          <div>
            <label htmlFor="vehicleId" className={labelClass}>
              Vehicle
            </label>
            <select
              id="vehicleId"
              name="vehicleId"
              required
              className={inputClass}
            >
              <option value="">Select vehicle</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.make} {vehicle.model} ({vehicle.year})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="serviceId" className={labelClass}>
              Service
            </label>
            <select
              id="serviceId"
              name="serviceId"
              required
              className={inputClass}
            >
              <option value="">Select service</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="preferredDate" className={labelClass}>
              Preferred date
            </label>
            <input
              id="preferredDate"
              name="preferredDate"
              type="date"
              required
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="locationType" className={labelClass}>
              Location
            </label>
            <select
              id="locationType"
              name="locationType"
              required
              className={inputClass}
            >
              <option value="workshop">AfricaChip workshop</option>
              <option value="customer">My location</option>
            </select>
          </div>

          <div>
            <label htmlFor="address" className={labelClass}>
              Address
            </label>
            <input
              id="address"
              name="address"
              placeholder="If requesting at your location"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="notes" className={labelClass}>
              Additional information
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={4}
              className={`${inputClass} resize-none`}
            />
          </div>

          <button type="submit" className={primaryButtonClass}>
            Submit request
          </button>
        </form>
      </div>
    </div>
  );
}