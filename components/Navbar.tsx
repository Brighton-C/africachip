import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import NavMenu from "@/components/NavMenu";

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

  const isAdmin = !!role && ADMIN_ROLES.includes(role);

  return (
    <nav className="relative z-40 bg-white border-b border-steel-500/10">
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

        <NavMenu loggedIn={!!user} isAdmin={isAdmin} />
      </div>
    </nav>
  );
}