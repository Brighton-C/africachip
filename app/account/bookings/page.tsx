import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { STATUS_LABELS, STATUS_STYLES } from "@/lib/bookingStatus";

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
    <div className="max-w-2xl mx-auto px-4 py-10">
      <Link href="/account" className="text-sm text-steel-500 hover:text-navy-950">
        ← Account
      </Link>

      <div className="flex justify-between items-center mt-3 mb-6">
        <h1 className="font-display font-bold text-2xl">My Requests</h1>
        <Link
          href="/account/bookings/new"
          className="bg-orange-500 text-white rounded px-4 py-2 text-sm font-medium hover:bg-orange-500/90"
        >
          New Request
        </Link>
      </div>

      {bookings.length === 0 && (
        <div className="bg-white rounded-2xl border border-steel-500/10 p-6 text-center">
          <p className="text-sm text-steel-500">No service requests yet.</p>
        </div>
      )}

      <div className="space-y-3">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="bg-white rounded-2xl border border-steel-500/10 p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-display font-semibold">
                  {booking.service.name}
                </p>
                <p className="text-sm text-steel-500 mt-1">
                  {booking.vehicle.make} {booking.vehicle.model} (
                  {booking.vehicle.year})
                </p>
                <p className="text-sm text-steel-500">
                  Preferred date: {booking.preferredDate.toLocaleDateString()}
                </p>
                <p className="text-sm text-steel-500">
                  {booking.locationType === "workshop"
                    ? "AfricaChip workshop"
                    : `Your location${booking.address ? `: ${booking.address}` : ""}`}
                </p>
              </div>
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full border shrink-0 ${STATUS_STYLES[booking.status]}`}
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