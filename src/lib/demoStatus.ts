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
  labels: Record<AppointmentStatus, string>,
  locale = "en"
): boolean {
  const normalized = query.trim().toLocaleLowerCase(locale);
  if (!normalized) {
    return true;
  }

  return labels[status].toLocaleLowerCase(locale).includes(normalized);
}
