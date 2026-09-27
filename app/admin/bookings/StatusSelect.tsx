"use client";

import { useState } from "react";
import { updateBookingStatus } from "@/lib/actions/admin-booking";

const STATUSES = ["pending", "confirmed", "in_progress", "completed"];

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  confirmed: "bg-blue-100 text-blue-800 border-blue-200",
  in_progress: "bg-purple-100 text-purple-800 border-purple-200",
  completed: "bg-green-100 text-green-800 border-green-200",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  in_progress: "In Progress",
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
      className={`text-xs font-semibold px-3 py-1.5 rounded-full border cursor-pointer ${STATUS_STYLES[status]}`}
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {STATUS_LABELS[s]}
        </option>
      ))}
    </select>
  );
}