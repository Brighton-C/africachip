"use client";

import { updateBookingStatus } from "@/lib/actions/admin-booking";

const STATUSES = ["pending", "confirmed", "in_progress", "completed"];

export default function StatusSelect({
  bookingId,
  currentStatus,
}: {
  bookingId: string;
  currentStatus: string;
}) {
  return (
    <select
      defaultValue={currentStatus}
      onChange={(e) => updateBookingStatus(bookingId, e.target.value)}
      className="border rounded px-2 py-1 text-sm"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s.replace("_", " ")}
        </option>
      ))}
    </select>
  );
}