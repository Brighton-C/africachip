import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

const ADMIN_ROLES = ["superadmin", "owner", "dispatcher"];
const OWNER_ROLES = ["superadmin", "owner"];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true, active: true },
  });

  if (!dbUser || !dbUser.active || !ADMIN_ROLES.includes(dbUser.role)) {
    redirect("/account");
  }

  return (
    <div className="min-h-screen bg-fog-100">
      <div className="bg-white border-b border-steel-500/10">
        <div className="container-page flex gap-6 py-4 text-sm">
          <Link
            href="/admin/bookings"
            className="font-medium hover:text-orange-500"
          >
            Bookings
          </Link>
          {OWNER_ROLES.includes(dbUser.role) && (
            <Link
              href="/admin/services"
              className="font-medium hover:text-orange-500"
            >
              Services
            </Link>
          )}
          {OWNER_ROLES.includes(dbUser.role) && (
            <Link
              href="/admin/team"
              className="font-medium hover:text-orange-500"
            >
              Team
            </Link>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}