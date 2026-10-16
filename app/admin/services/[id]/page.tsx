import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { updateService, deleteService } from "@/lib/actions/admin-service";
import { notFound } from "next/navigation";
import {
  eyebrowClass,
  adminTitleClass,
  labelClass,
  inputClass,
  primaryButtonClass,
} from "@/lib/ui";

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const service = await prisma.service.findUnique({ where: { id } });

  if (!service) notFound();

  return (
    <div className="container-page pb-24 pt-12 md:pt-16">
      <Link
        href="/admin/services"
        className={`${eyebrowClass} transition-opacity hover:opacity-60`}
      >
        ← Services
      </Link>
      <h1 className={adminTitleClass}>Edit service</h1>

      <div className="mt-10 max-w-xl border-t border-fog-200 pt-10">
        <form action={updateService} className="space-y-5">
          <input type="hidden" name="id" value={service.id} />

          <div>
            <label htmlFor="name" className={labelClass}>
              Name
            </label>
            <input
              id="name"
              name="name"
              defaultValue={service.name}
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
              defaultValue={service.description ?? ""}
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
              defaultValue={service.price?.toString() ?? ""}
              className={inputClass}
            />
          </div>

          <button type="submit" className={primaryButtonClass}>
            Save changes
          </button>
        </form>

        <form action={deleteService} className="mt-10 border-t border-fog-200 pt-6">
          <input type="hidden" name="id" value={service.id} />
          <button
            type="submit"
            className="text-sm text-red-600 underline underline-offset-4 transition-opacity hover:opacity-60"
          >
            Delete this service
          </button>
        </form>
      </div>
    </div>
  );
}