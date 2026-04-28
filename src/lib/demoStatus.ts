import type { AppointmentStatus } from "./demoAppointments";

export type StatusTone = "warning" | "primary" | "success" | "danger";

export function getStatusTone(status: AppointmentStatus): StatusTone {
  switch (status) {
    case "pending":
      return "warning";
    case "inProgress":
      return "primary";
    case "cancelled":
      return "danger";
    case "approved":
    case "completed":
    default:
      return "success";
  }
}

export function matchesStatusSearch(
  status: AppointmentStatus,
  query: string,
  labels: Record<AppointmentStatus, string>
): boolean {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return true;
  }

  return labels[status].toLowerCase().includes(normalized);
}
