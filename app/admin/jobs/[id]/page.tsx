import { prisma } from "@/lib/prisma";
import { updateJob } from "@/lib/actions/job";
import { notFound } from "next/navigation";
import { uploadJobFile, getSignedFileUrl } from "@/lib/actions/file";

const STATUSES = ["confirmed", "in_progress", "completed"];

export default async function JobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const job = await prisma.job.findUnique({
  where: { id },
  include: {
    booking: {
      include: { vehicle: true, service: true, customer: true },
    },
    files: true,
  },
});

  if (!job) notFound();

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-semibold mb-2">
        {job.booking.service.name}
      </h1>
      <p className="text-gray-600 mb-6">
        {job.booking.vehicle.make} {job.booking.vehicle.model} (
        {job.booking.vehicle.year}) — {job.booking.customer.name} —{" "}
        {job.booking.customer.phone}
      </p>

      <form action={updateJob} className="space-y-4">
        <input type="hidden" name="jobId" value={job.id} />

        <div>
          <label className="text-sm font-medium block mb-1">
            ECU Information
          </label>
          <textarea
            name="ecuInformation"
            defaultValue={job.ecuInformation ?? ""}
            className="w-full border rounded px-3 py-2"
            rows={3}
          />
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">
            Technician Notes
          </label>
          <textarea
            name="technicianNotes"
            defaultValue={job.technicianNotes ?? ""}
            className="w-full border rounded px-3 py-2"
            rows={4}
          />
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">Status</label>
          <select
            name="status"
            defaultValue={job.status}
            className="w-full border rounded px-3 py-2"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="bg-black text-white rounded px-6 py-2"
        >
          Save
        </button>
      </form>
            <div className="mt-10 border-t pt-6">
        <h2 className="text-lg font-semibold mb-4">ECU Files</h2>

        <div className="space-y-2 mb-6">
          {job.files.length === 0 && (
            <p className="text-gray-600 text-sm">No files uploaded yet.</p>
          )}
          {await Promise.all(
            job.files.map(async (file) => {
              const url = await getSignedFileUrl(file.storagePath);
              return (
                <div
                  key={file.id}
                  className="flex justify-between items-center border rounded px-3 py-2 text-sm"
                >
                  <span>
                    <span className="font-medium">{file.type}</span> —{" "}
                    {file.filename}
                  </span>
                  {url ? (
                    <a href={url} className="underline" target="_blank">
                      Download
                    </a>
                  ) : (
                    <span className="text-red-600">Link unavailable</span>
                  )}
                </div>
              );
            })
          )}
        </div>

        <form action={uploadJobFile} className="space-y-3">
          <input type="hidden" name="jobId" value={job.id} />
          <select name="type" required className="w-full border rounded px-3 py-2">
            <option value="original">Original file</option>
            <option value="modified">Modified file</option>
          </select>
          <input
            type="file"
            name="file"
            required
            className="w-full border rounded px-3 py-2"
          />
          <button
            type="submit"
            className="bg-black text-white rounded px-6 py-2"
          >
            Upload
          </button>
        </form>
      </div>
    </div>
  );
}