"use client";

import { updateUserRole } from "@/lib/actions/team";
import { ROLE_LABELS } from "@/lib/roleLabels";

const ALL_ROLES = ["dispatcher", "owner", "superadmin"];

export default function RoleSelect({
  userId,
  currentRole,
}: {
  userId: string;
  currentRole: string;
}) {
  return (
    <select
      defaultValue={currentRole}
      onChange={(e) => updateUserRole(userId, e.target.value)}
      className="border border-steel-500/20 rounded px-2 py-1 text-sm"
    >
      {ALL_ROLES.map((r) => (
        <option key={r} value={r}>
          {ROLE_LABELS[r]}
        </option>
      ))}
    </select>
  );
}