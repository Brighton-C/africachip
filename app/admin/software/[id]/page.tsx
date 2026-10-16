import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { updateSoftware, deleteSoftware } from "@/lib/actions/admin-software";
import { requireOwnerPage } from "@/lib/requireOwner";
import { notFound } from "next/navigation";
import {
  eyebrowClass,
  adminTitleClass,
  labelClass,
  inputClass,
  primaryButtonClass,
} from "@/lib/ui";

export default async function EditSoftwarePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireOwnerPage();

  const { id } = await params;
  const product = await prisma.software.findUnique({ where: { id } });

  if (!product) notFound();

  return (
    <div className="container-page pb-24 pt-12 md:pt-16">
      <Link
        href="/admin/software"
        className={`${eyebrowClass} transition-opacity hover:opacity-60`}
      >
        ← Software
      </Link>
      <h1 className={adminTitleClass}>Edit software</h1>

      <div className="mt-10 max-w-xl border-t border-fog-200 pt-10">
        <form action={updateSoftware} className="space-y-5">
          <input type="hidden" name="id" value={product.id} />

          <div>
            <label htmlFor="name" className={labelClass}>
              Name
            </label>
            <input
              id="name"
              name="name"
              defaultValue={product.name}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="description" className={labelClass}>
              Description
            </label>
            <textarea
              id="description"
              name="description"
              defaultValue={product.description ?? ""}
              rows={4}
              className={`${inputClass} resize-none`}
            />
          </div>

          <div>
            <label htmlFor="price" className={labelClass}>
              Price
            </label>
            <input
              id="price"
              name="price"
              type="number"
              step="0.01"
              defaultValue={product.price?.toString() ?? ""}
              className={inputClass}
            />
          </div>

          <label className="flex items-center gap-3 text-sm text-navy-950">
            <input
              type="checkbox"
              name="active"
              defaultChecked={product.active}
              className="h-4 w-4 accent-navy-950"
            />
            Show on the website
          </label>

          <button type="submit" className={primaryButtonClass}>
            Save changes
          </button>
        </form>

        <form action={deleteSoftware} className="mt-10 border-t border-fog-200 pt-6">
          <input type="hidden" name="id" value={product.id} />
          <button
            type="submit"
            className="text-sm text-red-600 underline underline-offset-4 transition-opacity hover:opacity-60"
          >
            Delete this software
          </button>
        </form>
      </div>
    </div>
  );
}