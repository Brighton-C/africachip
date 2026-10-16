import { prisma } from "@/lib/prisma";
import { updateJob } from "@/lib/actions/job";
import { notFound } from "next/navigation";
import { uploadJobFile, getSignedFileUrl } from "@/lib/actions/file";
import {
  eyebrowClass,
  adminTitleClass,
  sectionTitleClass,
  labelClass,
  inputClass,
  primaryButtonClass,
} from "@/lib/ui";

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
    <div className="container-page pb-24 pt-12 md:pt-16">
      <p className={eyebrowClass}>Job</p>
      <h1 className={adminTitleClass}>{job.booking.service.name}</h1>
      <p className="mt-4 max-w-xl text-sm leading-6 text-steel-500">
        {job.booking.vehicle.make} {job.booking.vehicle.model} (
        {job.booking.vehicle.year}) · {job.booking.customer.name} ·{" "}
        {job.booking.customer.phone}
      </p>

      <div className="mt-10 max-w-2xl border-t border-fog-200 pt-10">
        <form action={updateJob} className="space-y-5">
          <input type="hidden" name="jobId" value={job.id} />

          <div>
            <label htmlFor="ecuInformation" className={labelClass}>
              ECU information
            </label>
            <textarea
              id="ecuInformation"
              name="ecuInformation"
              defaultValue={job.ecuInformation ?? ""}
              className={`${inputClass} resize-none`}
              rows={3}
            />
          </div>

          <div>
            <label htmlFor="technicianNotes" className={labelClass}>
              Technician notes
            </label>
            <textarea
              id="technicianNotes"
              name="technicianNotes"
              defaultValue={job.technicianNotes ?? ""}
              className={`${inputClass} resize-none`}
              rows={4}
            />
          </div>

          <div>
            <label htmlFor="status" className={labelClass}>
              Status
            </label>
            <select
              id="status"
              name="status"
              defaultValue={job.status}
              className={inputClass}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className={primaryButtonClass}>
            Save
          </button>
        </form>

        {/* Files */}
        <div className="mt-16 border-t border-fog-200 pt-10">
          <h2 className={sectionTitleClass}>ECU files</h2>

          <div className="mt-6 border-t border-fog-200">
            {job.files.length === 0 && (
              <p className="border-b border-fog-200 py-4 text-sm text-steel-500">
                No files uploaded yet.
              </p>
            )}
            {await Promise.all(
              job.files.map(async (file) => {
                const url = await getSignedFileUrl(file.storagePath);
                return (
                  <div
                    key={file.id}
                    className="flex items-center justify-between gap-4 border-b border-fog-200 py-4 text-sm"
                  >
                    <span className="text-navy-950">
                      <span className="text-xs uppercase tracking-widest text-steel-500">
                        {file.type}
                      </span>
                      <span className="ml-3">{file.filename}</span>
                    </span>
                    {url ? (
                      <a
                        href={url}
                        target="_blank"
                        className="text-navy-950 underline underline-offset-4 transition-opacity hover:opacity-60"
                      >
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

          <form action={uploadJobFile} className="mt-8 space-y-4">
            <input type="hidden" name="jobId" value={job.id} />
            <select name="type" required className={inputClass}>
              <option value="original">Original file</option>
              <option value="modified">Modified file</option>
            </select>
            <input type="file" name="file" required className={inputClass} />
            <button type="submit" className={primaryButtonClass}>
              Upload
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}