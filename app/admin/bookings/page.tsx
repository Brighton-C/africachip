import { prisma } from "@/lib/prisma";
import Link from "next/link";
import StatusSelect from "./StatusSelect";
import { eyebrowClass, adminTitleClass } from "@/lib/ui";

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  in_progress: "In progress",
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
    <div className="container-page pb-24 pt-12 md:pt-16">
      <p className={eyebrowClass}>Admin</p>
      <h1 className={adminTitleClass}>Bookings</h1>

      {/* Counts */}
      <div className="mt-10 grid grid-cols-2 gap-8 border-t border-fog-200 pt-8 md:grid-cols-4">
        {Object.entries(counts).map(([key, value]) => (
          <div key={key}>
            <p className="font-display text-5xl font-normal leading-none tracking-[-0.04em] text-navy-950 lg:text-6xl">
              {value}
            </p>
            <p className="mt-3 text-xs uppercase tracking-widest text-steel-500">
              {STATUS_LABELS[key]}
            </p>
          </div>
        ))}
      </div>

      {/* List */}
      <div className="mt-12 border-t border-fog-200">
        {bookings.map((booking) => (
          <div key={booking.id} className="border-b border-fog-200 py-7">
            <div className="flex items-start justify-between gap-6">
              <div className="flex-1">
                <h2 className="font-display text-lg font-normal">
                  {booking.service.name}
                </h2>

                <dl className="mt-5 grid gap-x-10 gap-y-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-xs uppercase tracking-widest text-steel-500">
                      Customer
                    </dt>
                    <dd className="mt-1 text-sm text-navy-950">
                      {booking.customer.name} · {booking.customer.phone}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-widest text-steel-500">
                      Vehicle
                    </dt>
                    <dd className="mt-1 text-sm text-navy-950">
                      {booking.vehicle.make} {booking.vehicle.model} (
                      {booking.vehicle.year})
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-widest text-steel-500">
                      Date
                    </dt>
                    <dd className="mt-1 text-sm text-navy-950">
                      {booking.preferredDate.toLocaleDateString()}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-widest text-steel-500">
                      Location
                    </dt>
                    <dd className="mt-1 text-sm text-navy-950">
                      {booking.locationType === "workshop"
                        ? "Workshop"
                        : `Customer location${booking.address ? `: ${booking.address}` : ""}`}
                    </dd>
                  </div>
                </dl>

                {booking.notes && (
                  <p className="mt-5 max-w-xl text-sm leading-6 text-steel-500">
                    &quot;{booking.notes}&quot;
                  </p>
                )}

                {booking.job && (
                  <Link
                    href={`/admin/jobs/${booking.job.id}`}
                    className="mt-5 inline-block text-sm font-medium text-navy-950 underline underline-offset-4 transition-opacity hover:opacity-60"
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