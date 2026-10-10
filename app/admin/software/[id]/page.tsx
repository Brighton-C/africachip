import { prisma } from "@/lib/prisma";
import { updateSoftware, deleteSoftware } from "@/lib/actions/admin-software";
import { requireOwnerPage } from "@/lib/requireOwner";
import { notFound } from "next/navigation";

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
    <div className="max-w-xl mx-auto px-4 py-12">
      <h1 className="font-display font-bold text-2xl mb-6">Edit Software</h1>

      <form
        action={updateSoftware}
        className="space-y-4 bg-white border border-steel-500/10 rounded-xl p-6"
      >
        <input type="hidden" name="id" value={product.id} />
        <input
          name="name"
          defaultValue={product.name}
          required
          className="w-full border border-steel-500/20 rounded px-3 py-2 text-sm"
        />
        <textarea
          name="description"
          defaultValue={product.description ?? ""}
          className="w-full border border-steel-500/20 rounded px-3 py-2 text-sm"
        />
        <input
          name="price"
          type="number"
          step="0.01"
          defaultValue={product.price?.toString() ?? ""}
          className="w-full border border-steel-500/20 rounded px-3 py-2 text-sm"
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="active"
            defaultChecked={product.active}
          />
          Show on the website
        </label>
        <button
          type="submit"
          className="bg-orange-500 text-white rounded px-6 py-2 text-sm font-medium hover:bg-orange-500/90"
        >
          Save Changes
        </button>
      </form>

      <form action={deleteSoftware} className="mt-4">
        <input type="hidden" name="id" value={product.id} />
        <button type="submit" className="text-red-600 text-sm underline">
          Delete this software
        </button>
      </form>
    </div>
  );
}