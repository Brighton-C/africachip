import { prisma } from "@/lib/prisma";
import { updateBookingStatus } from "@/lib/actions/admin-booking";
import StatusSelect from "./StatusSelect";

const STATUSES = ["pending", "confirmed", "in_progress", "completed"];

export default async function AdminBookingsPage() {
  const bookings = await prisma.booking.findMany({
    include: { vehicle: true, service: true, customer: true, job: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-semibold mb-6">Bookings</h1>

      <div className="space-y-4">
        {bookings.map((booking) => (
          <div key={booking.id} className="border rounded p-4">
            <div className="flex justify-between items-start gap-4">
              <div>
                <p className="font-medium">{booking.service.name}</p>
                <p className="text-sm text-gray-600">
                  {booking.customer.name} — {booking.customer.email}
                </p>
                <p className="text-sm text-gray-600">{booking.customer.phone}</p>
                <p className="text-sm text-gray-600">
                  {booking.vehicle.make} {booking.vehicle.model} (
                  {booking.vehicle.year})
                </p>
                <p className="text-sm text-gray-600">
                  Preferred: {booking.preferredDate.toLocaleDateString()} —{" "}
                  {booking.locationType === "workshop"
                    ? "Workshop"
                    : `Customer location${booking.address ? `: ${booking.address}` : ""}`}
                </p>
                {booking.notes && (
                  <p className="text-sm text-gray-600 mt-1">
                    Notes: {booking.notes}
                  </p>
                )}

                {booking.job && (
                  <a href={`/admin/jobs/${booking.job.id}`} className="text-sm underline">
                    Open job
                  </a>
                )}
              </div>

              <StatusSelect bookingId={booking.id} currentStatus={booking.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}