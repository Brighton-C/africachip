import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { STATUS_LABELS, STATUS_STYLES } from "@/lib/bookingStatus";
import { eyebrowClass, adminTitleClass, primaryButtonClass } from "@/lib/ui";

export default async function BookingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const bookings = await prisma.booking.findMany({
    where: { customerId: user!.id },
    include: { vehicle: true, service: true },
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

      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className={adminTitleClass}>My requests</h1>
        <Link href="/account/bookings/new" className={primaryButtonClass}>
          New request
        </Link>
      </div>

      <div className="mt-10 max-w-3xl border-t border-fog-200">
        {bookings.length === 0 && (
          <p className="border-b border-fog-200 py-5 text-sm text-steel-500">
            No service requests yet.
          </p>
        )}

        {bookings.map((booking) => (
          <div key={booking.id} className="border-b border-fog-200 py-6">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="font-display text-lg font-normal">
                  {booking.service.name}
                </p>
                <p className="mt-2 text-sm text-steel-500">
                  {booking.vehicle.make} {booking.vehicle.model} (
                  {booking.vehicle.year})
                </p>
                <p className="mt-0.5 text-sm text-steel-500">
                  Preferred date: {booking.preferredDate.toLocaleDateString()}
                </p>
                <p className="mt-0.5 text-sm text-steel-500">
                  {booking.locationType === "workshop"
                    ? "AfricaChip workshop"
                    : `Your location${booking.address ? `: ${booking.address}` : ""}`}
                </p>
              </div>
              <span
                className={`keep-round shrink-0 rounded-full border px-3 py-1 text-xs font-medium ${STATUS_STYLES[booking.status]}`}
              >
                {STATUS_LABELS[booking.status]}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}