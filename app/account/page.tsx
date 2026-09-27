import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Car, CalendarPlus, ClipboardList } from "lucide-react";
import { STATUS_LABELS, STATUS_STYLES } from "@/lib/bookingStatus";

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
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="bg-white rounded-2xl border border-steel-500/10 p-6 mb-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-orange-500">
          My Account
        </p>
        <h1 className="mt-1 font-display font-bold text-2xl">
          Welcome back{dbUser?.name ? `, ${dbUser.name.split(" ")[0]}` : ""}
        </h1>
        <p className="mt-1 text-sm text-steel-500">
          {vehicleCount} vehicle{vehicleCount === 1 ? "" : "s"} on file
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <Link
          href="/account/vehicles"
          className="bg-white rounded-2xl border border-steel-500/10 p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <Car className="text-orange-500 mb-3" size={22} />
          <p className="font-display font-semibold">My Vehicles</p>
          <p className="text-sm text-steel-500 mt-1">
            Add or view your saved vehicles.
          </p>
        </Link>
        <Link
          href="/account/bookings/new"
          className="bg-white rounded-2xl border border-steel-500/10 p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <CalendarPlus className="text-orange-500 mb-3" size={22} />
          <p className="font-display font-semibold">Request a Service</p>
          <p className="text-sm text-steel-500 mt-1">
            Book a new service for your vehicle.
          </p>
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-steel-500/10 p-6">
        <div className="flex justify-between items-center mb-4">
          <p className="font-display font-semibold flex items-center gap-2">
            <ClipboardList size={18} className="text-orange-500" />
            Recent Requests
          </p>
          <Link
            href="/account/bookings"
            className="text-xs font-medium text-orange-500 underline"
          >
            View all
          </Link>
        </div>

        {recentBookings.length === 0 ? (
          <p className="text-sm text-steel-500">No service requests yet.</p>
        ) : (
          <div className="space-y-3">
            {recentBookings.map((booking) => (
              <div
                key={booking.id}
                className="flex justify-between items-center border-b border-steel-500/10 pb-3 last:border-0 last:pb-0"
              >
                <div>
                  <p className="text-sm font-medium">
                    {booking.service.name}
                  </p>
                  <p className="text-xs text-steel-500">
                    {booking.vehicle.make} {booking.vehicle.model}
                  </p>
                </div>
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full border ${STATUS_STYLES[booking.status]}`}
                >
                  {STATUS_LABELS[booking.status]}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}