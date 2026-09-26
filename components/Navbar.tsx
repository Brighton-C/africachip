import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { signOut } from "@/lib/actions/auth";

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
    <nav className="border-b">
      <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="font-semibold">
          AfroChip
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/services">Services</Link>

          {user ? (
            <>
              <Link href="/account">My Account</Link>
              {role && ADMIN_ROLES.includes(role) && (
                <Link href="/admin/bookings">Admin</Link>
              )}
              <form action={signOut}>
                <button type="submit" className="underline">
                  Log out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login">Log in</Link>
              <Link
                href="/signup"
                className="bg-black text-white rounded px-4 py-2"
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