import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createSoftware } from "@/lib/actions/admin-software";
import { requireOwnerPage } from "@/lib/requireOwner";
import {
  eyebrowClass,
  adminTitleClass,
  sectionTitleClass,
  inputClass,
  primaryButtonClass,
} from "@/lib/ui";

export default async function AdminSoftwarePage() {
  await requireOwnerPage();

  const products = await prisma.software.findMany({
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="container-page pb-24 pt-12 md:pt-16">
      <p className={eyebrowClass}>Admin</p>
      <h1 className={adminTitleClass}>Software</h1>

      <div className="mt-10 max-w-3xl border-t border-fog-200">
        {products.length === 0 && (
          <p className="border-b border-fog-200 py-5 text-sm text-steel-500">
            No software added yet.
          </p>
        )}
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/admin/software/${product.id}`}
            className="flex items-center justify-between gap-6 border-b border-fog-200 py-5 transition-opacity hover:opacity-60"
          >
            <div>
              <p className="font-display text-lg font-normal">
                {product.name}
                {!product.active && (
                  <span className="ml-2 text-xs text-steel-500">(hidden)</span>
                )}
              </p>
              <p className="mt-1 text-sm text-steel-500">
                {product.description}
              </p>
            </div>
            <div className="shrink-0 text-sm text-steel-500">
              {product.price ? `$${product.price.toString()}` : "No price set"}
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-16 max-w-xl">
        <h2 className={sectionTitleClass}>Add software</h2>
        <form action={createSoftware} className="mt-8 space-y-4">
          <input
            name="name"
            placeholder="Name"
            required
            className={inputClass}
          />
          <textarea
            name="description"
            placeholder="Description"
            rows={4}
            className={`${inputClass} resize-none`}
          />
          <input
            name="price"
            type="number"
            step="0.01"
            placeholder="Price (optional)"
            className={inputClass}
          />
          <button type="submit" className={primaryButtonClass}>
            Add software
          </button>
        </form>
      </div>
    </div>
  );
}