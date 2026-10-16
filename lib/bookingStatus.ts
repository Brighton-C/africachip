export const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  in_progress: "In progress",
  completed: "Completed",
};

// Light to dark as the job progresses. Same scheme as the admin StatusSelect.
export const STATUS_STYLES: Record<string, string> = {
  pending: "bg-fog-100 text-steel-500 border-fog-200",
  confirmed: "bg-navy-700/10 text-navy-700 border-navy-700/20",
  in_progress: "bg-navy-700 text-white border-navy-700",
  completed: "bg-navy-950 text-white border-navy-950",
};