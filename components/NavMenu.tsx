"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { signOut } from "@/lib/actions/auth";
import { createClient } from "@/lib/supabase/client";

export default function NavMenu({
  loggedIn,
  isAdmin,
}: {
  loggedIn: boolean;
  isAdmin: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();

  // Keep the server-rendered navbar in step with the browser's real session.
  // Only refreshes when the two disagree, so it doesn't fire on every tab focus.
  useEffect(() => {
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!!session !== loggedIn) {
        router.refresh();
      }
    });
    return () => subscription.unsubscribe();
  }, [loggedIn, router]);

  // The menu counts as open only on the page where it was opened, so it
  // closes by itself whenever the route changes.
  const [openPath, setOpenPath] = useState<string | null>(null);
  const open = openPath === pathname;
  const close = () => setOpenPath(null);

  const mobileLink =
    "block py-3 border-b border-steel-500/10 hover:text-orange-500";

  return (
    <>
      {/* Desktop links */}
      <div className="hidden md:flex items-center gap-6 text-sm text-navy-950">
        <Link href="/services" className="hover:text-orange-500">
          Services
        </Link>
        <Link href="/contact" className="hover:text-orange-500">
          Contact
        </Link>

        {loggedIn ? (
          <>
            <Link href="/account" className="hover:text-orange-500">
              My Account
            </Link>
            {isAdmin && (
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

      {/* Mobile menu button */}
      <button
        type="button"
        className="md:hidden p-2 -mr-2 text-navy-950"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpenPath(open ? null : pathname)}
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile menu panel */}
      {open && (
        <div
          id="mobile-menu"
          className="md:hidden absolute left-0 right-0 top-full bg-white border-b border-steel-500/10 shadow-lg"
        >
          <div className="container-page py-2 text-sm text-navy-950">
            <Link href="/services" onClick={close} className={mobileLink}>
              Services
            </Link>
            <Link href="/contact" onClick={close} className={mobileLink}>
              Contact
            </Link>

            {loggedIn ? (
              <>
                <Link href="/account" onClick={close} className={mobileLink}>
                  My Account
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin/bookings"
                    onClick={close}
                    className={mobileLink}
                  >
                    Admin
                  </Link>
                )}
                <form action={signOut}>
                  <button
                    type="submit"
                    className="w-full text-left py-3 hover:text-orange-500"
                  >
                    Log out
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link href="/login" onClick={close} className={mobileLink}>
                  Log in
                </Link>
                <Link
                  href="/signup"
                  onClick={close}
                  className="mt-3 mb-2 block text-center bg-orange-500 text-white rounded-lg px-4 py-3 font-medium hover:bg-orange-500/90"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}