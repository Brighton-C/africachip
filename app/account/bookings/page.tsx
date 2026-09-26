import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  in_progress: "In Progress",
  completed: "Completed",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  in_progress: "bg-purple-100 text-purple-800",
  completed: "bg-green-100 text-green-800",
};

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
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">My Requests</h1>
        <Link
          href="/account/bookings/new"
          className="bg-black text-white rounded px-4 py-2 text-sm"
        >
          New Request
        </Link>
      </div>

      {bookings.length === 0 && (
        <p className="text-gray-600">No service requests yet.</p>
      )}

      <div className="space-y-4">
        {bookings.map((booking) => (
          <div key={booking.id} className="border rounded p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{booking.service.name}</p>
                <p className="text-sm text-gray-600">
                  {booking.vehicle.make} {booking.vehicle.model} (
                  {booking.vehicle.year})
                </p>
                <p className="text-sm text-gray-600">
                  Preferred date:{" "}
                  {booking.preferredDate.toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  {booking.locationType === "workshop"
                    ? "AfroChip workshop"
                    : `Your location${booking.address ? `: ${booking.address}` : ""}`}
                </p>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded ${STATUS_COLORS[booking.status]}`}
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