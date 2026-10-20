"use client";

import { useState } from "react";
import { updateBookingStatus } from "@/lib/actions/admin-booking";

const STATUSES = ["pending", "confirmed", "in_progress", "completed"];

// Light to dark as the job progresses.
const STATUS_STYLES: Record<string, string> = {
  pending: "bg-fog-100 text-steel-500 border-fog-200",
  confirmed: "bg-navy-700/10 text-navy-700 border-navy-700/20",
  in_progress: "bg-navy-700 text-white border-navy-700",
  completed: "bg-navy-950 text-white border-navy-950",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  in_progress: "In progress",
  completed: "Completed",
};

export default function StatusSelect({
  bookingId,
  currentStatus,
}: {
  bookingId: string;
  currentStatus: string;
}) {
  const [status, setStatus] = useState(currentStatus);

  return (
    <select
      value={status}
      onChange={(e) => {
        setStatus(e.target.value);
        updateBookingStatus(bookingId, e.target.value);
      }}
      className={` cursor-pointer  border px-4 py-1.5 text-xs font-medium focus:outline-none [&>option]:bg-white [&>option]:text-navy-950 ${STATUS_STYLES[status]}`}
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {STATUS_LABELS[s]}
        </option>
      ))}
    </select>
  );
}