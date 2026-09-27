import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { createStaffAccount, setAccountActive } from "@/lib/actions/team";
import RoleSelect from "@/components/admin/RoleSelect";
import { ROLE_LABELS } from "@/lib/roleLabels";
import { Role } from "@prisma/client";

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
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="font-display font-bold text-2xl mb-6">Team</h1>

      {created && temp && (
        <div className="mb-8 rounded-xl border border-orange-500/30 bg-orange-50 p-4 text-sm">
          <p className="font-medium">Account created for {created}</p>
          <p className="mt-1 text-steel-500">
            Temporary password:{" "}
            <span className="font-mono font-semibold text-navy-950">
              {temp}
            </span>
          </p>
          <p className="mt-1 text-steel-500">
            Share this with them directly. They should log in and use
            &quot;Forgot password?&quot; to set their own password. This
            won&apos;t be shown again.
          </p>
        </div>
      )}

      <div className="space-y-3 mb-12">
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
              className="flex items-center justify-between border border-steel-500/10 rounded-xl p-4 bg-white"
            >
              <div>
                <p className="font-display font-semibold">
                  {member.name}{" "}
                  {!member.active && (
                    <span className="text-xs font-normal text-red-600">
                      (deactivated)
                    </span>
                  )}
                </p>
                <p className="text-sm text-steel-500">{member.email}</p>
              </div>

              <div className="flex items-center gap-3">
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
                      className="text-sm underline text-red-600"
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

      <h2 className="font-display font-semibold text-lg mb-4">
        Add a staff account
      </h2>
      <form
        action={createStaffAccount}
        className="space-y-4 bg-white border border-steel-500/10 rounded-xl p-6 max-w-md"
      >
        <input
          name="name"
          placeholder="Full name"
          required
          className="w-full border border-steel-500/20 rounded px-3 py-2 text-sm"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          className="w-full border border-steel-500/20 rounded px-3 py-2 text-sm"
        />

        {isSuperadmin ? (
          <select
            name="role"
            defaultValue="dispatcher"
            className="w-full border border-steel-500/20 rounded px-3 py-2 text-sm"
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

        <button
          type="submit"
          className="bg-orange-500 text-white rounded px-6 py-2 text-sm font-medium hover:bg-orange-500/90"
        >
          Create Account
        </button>
      </form>
    </div>
  );
}