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

  // The menu counts as open only on the page where it was opened,
  // so it closes by itself whenever the route changes.
  const [openPath, setOpenPath] = useState<string | null>(null);
  const open = openPath === pathname;
  const close = () => setOpenPath(null);

  const desktopLink = "text-white/75 transition-colors hover:text-white";
  const mobileLink =
    "block border-b border-white/10 py-3 text-white/80 hover:text-white";

  return (
    <>
      {/* Desktop links */}
      <div className="hidden items-center gap-6 text-sm md:flex">
        <Link href="/services" className={desktopLink}>
          Services
        </Link>
        <Link href="/software" className={desktopLink}>
          Software
        </Link>
        <Link href="/contact" className={desktopLink}>
          Contact
        </Link>

        {loggedIn ? (
          <>
            <Link href="/account" className={desktopLink}>
              My Account
            </Link>
            {isAdmin && (
              <Link href="/admin/bookings" className={desktopLink}>
                Admin
              </Link>
            )}
            <form action={signOut}>
              <button type="submit" className={desktopLink}>
                Log out
              </button>
            </form>
          </>
        ) : (
          <>
            <Link href="/login" className={desktopLink}>
              Log in
            </Link>
            <Link
              href="/signup"
              className="bg-white px-4 py-2 font-medium text-navy-950 transition hover:bg-white/90"
            >
              Sign up
            </Link>
          </>
        )}
      </div>

      {/* Mobile menu button */}
      <button
        type="button"
        className="-mr-2 p-2 text-white md:hidden"
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
          className="absolute left-0 right-0 top-full border-b border-white/10 bg-navy-950 shadow-xl md:hidden"
        >
          <div className="container-page py-2 text-sm text-white">
            <Link href="/services" onClick={close} className={mobileLink}>
              Services
            </Link>
            <Link href="/software" onClick={close} className={mobileLink}>
              Software
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
                    className="w-full py-3 text-left text-white/80 hover:text-white"
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
                  className="mb-2 mt-3 block bg-white px-4 py-3 text-center font-medium text-navy-950 hover:bg-white/90"
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