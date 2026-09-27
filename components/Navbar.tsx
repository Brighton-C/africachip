import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { signOut } from "@/lib/actions/auth";
import Image from "next/image";

const ADMIN_ROLES = ["superadmin", "owner", "dispatcher"];

export default async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let role: string | null = null;
  if (user) {
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    });
    role = dbUser?.role ?? null;
  }

  return (
    <nav className="bg-white border-b border-steel-500/10">
      <div className="container-page py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center">
  <Image
    src="/images/africa chip.png"
    alt="AfricaChip Tuning"
    width={66}
    height={52}
    priority
    className="h-10 w-auto"
  />
</Link>
        <div className="flex items-center gap-6 text-sm text-navy-950">
          <Link href="/services" className="hover:text-orange-500">
            Services
          </Link>
<Link href="/contact" className="hover:text-orange-500">
  Contact
</Link>

          {user ? (
            <>
              <Link href="/account" className="hover:text-orange-500">
                My Account
              </Link>
              {role && ADMIN_ROLES.includes(role) && (
                <Link href="/admin/bookings" className="hover:text-orange-500">
                  Admin
                </Link>
              )}
              <form action={signOut}>
                <button type="submit" className="hover:text-orange-500">
                  Log out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-orange-500">
                Log in
              </Link>
              <Link
                href="/signup"
                className="bg-orange-500 text-white rounded px-4 py-2 hover:bg-orange-500/90"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}