import { prisma } from "@/lib/prisma";
import { updateService, deleteService } from "@/lib/actions/admin-service";
import { notFound } from "next/navigation";

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const service = await prisma.service.findUnique({ where: { id } });

  if (!service) notFound();

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <h1 className="font-display font-bold text-2xl mb-6">Edit Service</h1>

      <form
        action={updateService}
        className="space-y-4 bg-white border border-steel-500/10 rounded-xl p-6"
      >
        <input type="hidden" name="id" value={service.id} />
        <input
          name="name"
          defaultValue={service.name}
          required
          className="w-full border border-steel-500/20 rounded px-3 py-2 text-sm"
        />
        <textarea
          name="description"
          defaultValue={service.description ?? ""}
          className="w-full border border-steel-500/20 rounded px-3 py-2 text-sm"
        />
        <input
          name="price"
          type="number"
          step="0.01"
          defaultValue={service.price?.toString() ?? ""}
          className="w-full border border-steel-500/20 rounded px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="bg-orange-500 text-white rounded px-6 py-2 text-sm font-medium hover:bg-orange-500/90"
        >
          Save Changes
        </button>
      </form>

      <form action={deleteService} className="mt-4">
        <input type="hidden" name="id" value={service.id} />
        <button type="submit" className="text-red-600 text-sm underline">
          Delete this service
        </button>
      </form>
    </div>
  );
}