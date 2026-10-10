import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createSoftware } from "@/lib/actions/admin-software";
import { requireOwnerPage } from "@/lib/requireOwner";

export default async function AdminSoftwarePage() {
  await requireOwnerPage();

  const products = await prisma.software.findMany({
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="font-display font-bold text-2xl mb-6">Software</h1>

      <div className="space-y-3 mb-12">
        {products.length === 0 && (
          <p className="text-sm text-steel-500">No software added yet.</p>
        )}
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/admin/software/${product.id}`}
            className="flex justify-between items-center border border-steel-500/10 rounded-xl p-4 hover:shadow-sm transition-shadow bg-white"
          >
            <div>
              <p className="font-display font-semibold">
                {product.name}
                {!product.active && (
                  <span className="ml-2 text-xs font-normal text-steel-500">
                    (hidden)
                  </span>
                )}
              </p>
              <p className="text-sm text-steel-500">{product.description}</p>
            </div>
            <div className="ml-4 shrink-0 text-sm text-steel-500">
              {product.price ? `$${product.price.toString()}` : "No price set"}
            </div>
          </Link>
        ))}
      </div>

      <h2 className="font-display font-semibold text-lg mb-4">
        Add software
      </h2>
      <form
        action={createSoftware}
        className="space-y-4 bg-white border border-steel-500/10 rounded-xl p-6"
      >
        <input
          name="name"
          placeholder="Name"
          required
          className="w-full border border-steel-500/20 rounded px-3 py-2 text-sm"
        />
        <textarea
          name="description"
          placeholder="Description"
          className="w-full border border-steel-500/20 rounded px-3 py-2 text-sm"
        />
        <input
          name="price"
          type="number"
          step="0.01"
          placeholder="Price (optional)"
          className="w-full border border-steel-500/20 rounded px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="bg-orange-500 text-white rounded px-6 py-2 text-sm font-medium hover:bg-orange-500/90"
        >
          Add Software
        </button>
      </form>
    </div>
  );
}