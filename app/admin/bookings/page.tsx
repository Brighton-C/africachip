import { prisma } from "@/lib/prisma";
import Link from "next/link";
import StatusSelect from "./StatusSelect";


const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  in_progress: "In Progress",
  completed: "Completed",
};

export default async function AdminBookingsPage() {
  const bookings = await prisma.booking.findMany({
    include: { vehicle: true, service: true, customer: true, job: true },
    orderBy: { createdAt: "desc" },
  });

  const counts = {
    pending: bookings.filter((b) => b.status === "pending").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    in_progress: bookings.filter((b) => b.status === "in_progress").length,
    completed: bookings.filter((b) => b.status === "completed").length,
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="font-display font-bold text-2xl mb-6">Bookings</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {Object.entries(counts).map(([key, value]) => (
          <div
            key={key}
            className="bg-white rounded-xl border border-steel-500/10 p-4"
          >
            <p className="font-display font-bold text-2xl text-navy-950">
              {value}
            </p>
            <p className="text-xs text-steel-500 mt-1">
              {STATUS_LABELS[key]}
            </p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="bg-white rounded-2xl border border-steel-500/10 p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <p className="font-display font-semibold mb-2">
                  {booking.service.name}
                </p>

                                <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1 text-sm text-steel-500">
                  <p>
                    <span className="font-medium text-navy-950">Customer:</span>{" "}
                    {booking.customer.name} — {booking.customer.phone}
                  </p>
                  <p>
                    <span className="font-medium text-navy-950">Vehicle:</span>{" "}
                    {booking.vehicle.make} {booking.vehicle.model} (
                    {booking.vehicle.year})
                  </p>
                  <p>
                    <span className="font-medium text-navy-950">Date:</span>{" "}
                    {booking.preferredDate.toLocaleDateString()}
                  </p>
                  <p>
                    <span className="font-medium text-navy-950">Location:</span>{" "}
                    {booking.locationType === "workshop"
                      ? "Workshop"
                      : `Customer location${booking.address ? `: ${booking.address}` : ""}`}
                  </p>
                </div>

                {booking.notes && (
                  <p className="text-sm text-steel-500 mt-2 italic">
                    &quot;{booking.notes}&quot;
                  </p>
                )}

                {booking.job && (
                  <Link
                    href={`/admin/jobs/${booking.job.id}`}
                    className="text-xs font-medium text-orange-500 underline mt-2 inline-block"
                  >
                    Open job →
                  </Link>
                )}
              </div>

              <StatusSelect
                bookingId={booking.id}
                currentStatus={booking.status}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}