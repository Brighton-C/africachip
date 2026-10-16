import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { STATUS_LABELS, STATUS_STYLES } from "@/lib/bookingStatus";
import { eyebrowClass, adminTitleClass, sectionTitleClass } from "@/lib/ui";

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { name: true },
  });

  const [vehicleCount, recentBookings] = await Promise.all([
    prisma.vehicle.count({ where: { customerId: user.id } }),
    prisma.booking.findMany({
      where: { customerId: user.id },
      include: { vehicle: true, service: true },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
  ]);

  return (
    <div className="container-page pb-24 pt-12 md:pt-16">
      <p className={eyebrowClass}>My account</p>
      <h1 className={adminTitleClass}>
        Welcome back{dbUser?.name ? `, ${dbUser.name.split(" ")[0]}` : ""}
      </h1>
      <p className="mt-4 text-sm text-steel-500">
        {vehicleCount} vehicle{vehicleCount === 1 ? "" : "s"} on file
      </p>

      {/* Actions */}
      <div className="mt-12 grid gap-x-8 gap-y-10 border-t border-fog-200 pt-10 sm:grid-cols-2">
        <Link href="/account/vehicles" className="group block max-w-sm">
          <p className="font-display text-5xl font-normal leading-none tracking-[-0.04em] text-steel-300 lg:text-6xl">
            01
          </p>
          <p className="mt-8 font-display text-lg font-normal">My vehicles</p>
          <p className="mt-2 text-sm leading-6 text-steel-500">
            Add or view your saved vehicles.
          </p>
          <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-navy-950 transition-opacity group-hover:opacity-60">
            Open
            <ArrowRight size={13} />
          </span>
        </Link>

        <Link href="/account/bookings/new" className="group block max-w-sm">
          <p className="font-display text-5xl font-normal leading-none tracking-[-0.04em] text-steel-300 lg:text-6xl">
            02
          </p>
          <p className="mt-8 font-display text-lg font-normal">
            Request a service
          </p>
          <p className="mt-2 text-sm leading-6 text-steel-500">
            Book a new service for your vehicle.
          </p>
          <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-navy-950 transition-opacity group-hover:opacity-60">
            Start
            <ArrowRight size={13} />
          </span>
        </Link>
      </div>

      {/* Recent requests */}
      <div className="mt-16 max-w-3xl">
        <div className="flex items-center justify-between">
          <h2 className={sectionTitleClass}>Recent requests</h2>
          <Link
            href="/account/bookings"
            className="text-sm font-medium text-navy-950 underline underline-offset-4 transition-opacity hover:opacity-60"
          >
            View all
          </Link>
        </div>

        <div className="mt-6 border-t border-fog-200">
          {recentBookings.length === 0 ? (
            <p className="border-b border-fog-200 py-5 text-sm text-steel-500">
              No service requests yet.
            </p>
          ) : (
            recentBookings.map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between gap-4 border-b border-fog-200 py-5"
              >
                <div>
                  <p className="font-display text-base font-normal">
                    {booking.service.name}
                  </p>
                  <p className="mt-1 text-sm text-steel-500">
                    {booking.vehicle.make} {booking.vehicle.model}
                  </p>
                </div>
                <span
                  className={`keep-round shrink-0 rounded-full border px-3 py-1 text-xs font-medium ${STATUS_STYLES[booking.status]}`}
                >
                  {STATUS_LABELS[booking.status]}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}