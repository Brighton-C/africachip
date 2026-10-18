import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  eyebrowClass,
  adminTitleClass,
  sectionTitleClass,
  labelClass,
  inputClass,
  primaryButtonClass,
} from "@/lib/ui";

const OPEN_STATUSES = ["pending", "confirmed", "in_progress"] as const;

const SAVED: Record<string, string> = {
  details: "Details saved.",
  password: "Password updated.",
};

const ERRORS: Record<string, string> = {
  name: "Enter your full name.",
  phone: "Enter a valid phone number.",
  short: "Password must be at least 6 characters.",
  mismatch: "Passwords do not match.",
  password: "The password could not be updated. Try again.",
  confirm: "Type DELETE to confirm.",
  open: "You have open service requests. Wait until they are completed, or contact AfricaChip to cancel them.",
  staff: "Staff accounts are managed by the owner.",
  auth: "Your details were removed but sign-in could not be closed. Try again.",
};

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return { supabase, user };
}

function back(kind: "saved" | "error", code: string): never {
  redirect(`/account/profile?${kind}=${encodeURIComponent(code)}`);
}

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const { user } = await requireUser();
  const { saved, error } = await searchParams;

  const profile = await prisma.user.findUnique({
    where: { id: user.id },
    select: { name: true, email: true, phone: true, role: true },
  });
  if (!profile) redirect("/login");

  async function updateProfile(formData: FormData) {
    "use server";
    const { user } = await requireUser();

    const name = String(formData.get("name") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();

    if (name.length < 2) back("error", "name");
    if (phone.length < 7) back("error", "phone");

    await prisma.user.update({
      where: { id: user.id },
      data: { name, phone },
    });

    revalidatePath("/account");
    back("saved", "details");
  }

  async function changePassword(formData: FormData) {
    "use server";
    const { supabase } = await requireUser();

    const password = String(formData.get("password") ?? "");
    const confirm = String(formData.get("confirm") ?? "");

    if (password.length < 6) back("error", "short");
    if (password !== confirm) back("error", "mismatch");

    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });
    if (updateError) back("error", "password");

    back("saved", "password");
  }

  async function deleteAccount(formData: FormData) {
    "use server";
    const { supabase, user } = await requireUser();

    const me = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    });
    if (me && me.role !== "customer") back("error", "staff");

    if (String(formData.get("confirm") ?? "").trim() !== "DELETE") {
      back("error", "confirm");
    }

    const open = await prisma.booking.count({
      where: { customerId: user.id, status: { in: [...OPEN_STATUSES] } },
    });
    if (open > 0) back("error", "open");

    const total = await prisma.booking.count({
      where: { customerId: user.id },
    });

    if (total === 0) {
      await prisma.vehicle.deleteMany({ where: { customerId: user.id } });
      await prisma.user.deleteMany({ where: { id: user.id } });
    } else {
      await prisma.user.updateMany({
        where: { id: user.id },
        data: {
          name: "Deleted customer",
          email: `deleted-${user.id}@deleted.invalid`,
          phone: null,
          active: false,
        },
      });
    }

    const { error: authError } = await createAdminClient().auth.admin.deleteUser(
      user.id
    );
    if (authError) back("error", "auth");

    await supabase.auth.signOut();
    redirect("/");
  }

  const isCustomer = profile.role === "customer";

  return (
    <div className="container-page pb-24 pt-12 md:pt-16">
      <Link
        href="/account"
        className={`${eyebrowClass} transition-opacity hover:opacity-60`}
      >
        ← Account
      </Link>
      <h1 className={adminTitleClass}>My details</h1>

      <div className="mt-10 max-w-xl">
        {saved && (
          <p className="mb-8 border border-fog-200 bg-fog-100 px-4 py-3 text-sm text-navy-950">
            {SAVED[saved] ?? "Saved."}
          </p>
        )}
        {error && (
          <p className="mb-8 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {ERRORS[error] ?? "Something went wrong."}
          </p>
        )}

        {/* Details */}
        <section className="border-t border-fog-200 pt-10">
          <h2 className={sectionTitleClass}>Contact details</h2>

          <form action={updateProfile} className="mt-8 space-y-5">
            <div>
              <p className={labelClass}>Email</p>
              <p className="text-sm text-navy-950">{profile.email}</p>
              <p className="mt-1.5 text-xs text-steel-500">
                To change your email, contact AfricaChip.
              </p>
            </div>

            <div>
              <label htmlFor="name" className={labelClass}>
                Full name
              </label>
              <input
                id="name"
                name="name"
                defaultValue={profile.name}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="phone" className={labelClass}>
                Phone number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                defaultValue={profile.phone ?? ""}
                required
                className={inputClass}
              />
            </div>

            <button type="submit" className={primaryButtonClass}>
              Save changes
            </button>
          </form>
        </section>

        {/* Password */}
        <section className="mt-14 border-t border-fog-200 pt-10">
          <h2 className={sectionTitleClass}>Change password</h2>

          <form action={changePassword} className="mt-8 space-y-5">
            <div>
              <label htmlFor="password" className={labelClass}>
                New password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                minLength={6}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="confirm" className={labelClass}>
                Confirm new password
              </label>
              <input
                id="confirm"
                name="confirm"
                type="password"
                minLength={6}
                required
                className={inputClass}
              />
            </div>

            <button type="submit" className={primaryButtonClass}>
              Update password
            </button>
          </form>
        </section>

        {/* Delete */}
        <section className="mt-14 border-t border-fog-200 pt-10">
          {isCustomer ? (
            <>
              <h2 className="font-display text-2xl font-normal tracking-[-0.03em] text-red-700">
                Delete account
              </h2>
              <p className="mt-4 text-sm leading-6 text-steel-500">
                This removes your sign-in and personal details and cannot be
                undone. If you have booked with us before, the vehicle and job
                records stay with the workshop but are no longer linked to
                your name or contact details. You cannot delete your account
                while a service request is open.
              </p>

              <form action={deleteAccount} className="mt-8 space-y-5">
                <div>
                  <label htmlFor="delete-confirm" className={labelClass}>
                    Type DELETE to confirm
                  </label>
                  <input
                    id="delete-confirm"
                    name="confirm"
                    required
                    pattern="DELETE"
                    autoComplete="off"
                    className={inputClass}
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center bg-red-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-red-700"
                >
                  Delete my account
                </button>
              </form>
            </>
          ) : (
            <p className="text-sm text-steel-500">
              Staff accounts are managed by the owner under Admin, then Team.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}