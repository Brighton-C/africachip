import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { createStaffAccount, setAccountActive } from "@/lib/actions/team";
import RoleSelect from "@/components/admin/RoleSelect";
import { ROLE_LABELS } from "@/lib/roleLabels";
import { Role } from "@prisma/client";
import {
  eyebrowClass,
  adminTitleClass,
  sectionTitleClass,
  inputClass,
  primaryButtonClass,
} from "@/lib/ui";

const OWNER_ROLES: Role[] = ["superadmin", "owner"];
const HIGH_PRIVILEGE_ROLES: Role[] = ["superadmin", "owner"];
const ALL_ROLES: Role[] = ["dispatcher", "owner", "superadmin"];

export default async function TeamPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string; temp?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const viewer = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true, id: true },
  });

  if (!viewer || !OWNER_ROLES.includes(viewer.role)) {
    redirect("/admin/bookings");
  }

  const { created, temp } = await searchParams;

  const staff = await prisma.user.findMany({
    where: { role: { in: ALL_ROLES } },
    orderBy: { createdAt: "asc" },
  });

  const isSuperadmin = viewer.role === "superadmin";

  return (
    <div className="container-page pb-24 pt-12 md:pt-16">
      <p className={eyebrowClass}>Admin</p>
      <h1 className={adminTitleClass}>Team</h1>

      {created && temp && (
        <div className="mt-10 max-w-3xl border border-fog-200 bg-fog-100 p-5 text-sm">
          <p className="font-medium text-navy-950">
            Account created for {created}
          </p>
          <p className="mt-2 text-steel-500">
            Temporary password:{" "}
            <span className="font-mono font-semibold text-navy-950">
              {temp}
            </span>
          </p>
          <p className="mt-2 leading-6 text-steel-500">
            Share this with them directly. They should log in and use
            &quot;Forgot password?&quot; to set their own password. This
            won&apos;t be shown again.
          </p>
        </div>
      )}

      <div className="mt-10 max-w-3xl border-t border-fog-200">
        {staff.map((member) => {
          const targetIsHighPrivilege = HIGH_PRIVILEGE_ROLES.includes(
            member.role
          );
          const isSelf = member.id === viewer.id;
          const canDeactivate =
            !isSelf && (isSuperadmin || !targetIsHighPrivilege);

          return (
            <div
              key={member.id}
              className="flex flex-wrap items-center justify-between gap-4 border-b border-fog-200 py-5"
            >
              <div>
                <p className="font-display text-lg font-normal">
                  {member.name}{" "}
                  {!member.active && (
                    <span className="text-xs text-red-600">(deactivated)</span>
                  )}
                </p>
                <p className="mt-1 text-sm text-steel-500">{member.email}</p>
              </div>

              <div className="flex items-center gap-5">
                {isSuperadmin && !isSelf ? (
                  <RoleSelect userId={member.id} currentRole={member.role} />
                ) : (
                  <span className="text-sm text-steel-500">
                    {ROLE_LABELS[member.role]}
                  </span>
                )}

                {canDeactivate && (
                  <form action={setAccountActive}>
                    <input type="hidden" name="userId" value={member.id} />
                    <input
                      type="hidden"
                      name="active"
                      value={(!member.active).toString()}
                    />
                    <button
                      type="submit"
                      className="text-sm text-red-600 underline underline-offset-4 transition-opacity hover:opacity-60"
                    >
                      {member.active ? "Deactivate" : "Reactivate"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-16 max-w-xl">
        <h2 className={sectionTitleClass}>Add a staff account</h2>
        <form action={createStaffAccount} className="mt-8 space-y-4">
          <input
            name="name"
            placeholder="Full name"
            required
            className={inputClass}
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className={inputClass}
          />

          {isSuperadmin ? (
            <select
              name="role"
              defaultValue="dispatcher"
              className={inputClass}
            >
              <option value="dispatcher">Dispatcher</option>
              <option value="owner">Owner</option>
              <option value="superadmin">System Admin</option>
            </select>
          ) : (
            <p className="text-sm text-steel-500">
              New accounts are created as Dispatcher.
            </p>
          )}

          <button type="submit" className={primaryButtonClass}>
            Create account
          </button>
        </form>
      </div>
    </div>
  );
}