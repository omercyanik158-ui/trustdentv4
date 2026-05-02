export const DEMO_NOTIFICATIONS_KEY = "trustdent_notifications";

export type NotificationRole = "doctor" | "patient" | "admin" | "all";

export type DemoNotification = {
  id: number;
  role: NotificationRole;
  title: string;
  message: string;
  targetPath: string | null;
  createdAt: string;
  read: boolean;
};

const DEFAULT_NOTIFICATIONS: DemoNotification[] = [];
const TARGET_PATH_ALLOWLIST = new Set([
  "/patient/appointments",
  "/patient/documents",
  "/doctor/appointments",
  "/doctor/radiology",
  "/admin",
]);

function normalize(item: Partial<DemoNotification>): DemoNotification {
  const normalizedTargetPath =
    typeof item.targetPath === "string" && TARGET_PATH_ALLOWLIST.has(item.targetPath)
      ? item.targetPath
      : null;
  return {
    id: typeof item.id === "number" ? item.id : Date.now(),
    role: item.role ?? "all",
    title: (item.title ?? "Notification").trim(),
    message: (item.message ?? "").trim(),
    targetPath: normalizedTargetPath,
    createdAt: item.createdAt ?? new Date().toISOString(),
    read: Boolean(item.read),
  };
}

export function readDemoNotifications(): DemoNotification[] {
  if (typeof window === "undefined") return DEFAULT_NOTIFICATIONS;
  const raw = localStorage.getItem(DEMO_NOTIFICATIONS_KEY);
  if (!raw) return DEFAULT_NOTIFICATIONS;
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return DEFAULT_NOTIFICATIONS;
    return parsed.map((item) => normalize(item as Partial<DemoNotification>));
  } catch {
    return DEFAULT_NOTIFICATIONS;
  }
}

export function writeDemoNotifications(notifications: DemoNotification[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(DEMO_NOTIFICATIONS_KEY, JSON.stringify(notifications.map((item) => normalize(item))));
}

export function seedDemoNotifications(force = false): DemoNotification[] {
  if (typeof window === "undefined") return DEFAULT_NOTIFICATIONS;
  const current = readDemoNotifications();
  if (!force && current.length > 0) return current;
  writeDemoNotifications(DEFAULT_NOTIFICATIONS);
  return DEFAULT_NOTIFICATIONS;
}

export function resetDemoNotifications() {
  return seedDemoNotifications(true);
}

export function addDemoNotification(input: Omit<DemoNotification, "id" | "createdAt" | "read">) {
  return addDemoNotifications([input]);
}

export function addDemoNotifications(
  inputs: Array<Omit<DemoNotification, "id" | "createdAt" | "read">>
) {
  const current = readDemoNotifications();
  const timestamp = Date.now();
  const generated = inputs.map((input, index) =>
    normalize({
      ...input,
      id: timestamp + index,
      createdAt: new Date().toISOString(),
      read: false,
    })
  );
  const next: DemoNotification[] = [...generated, ...current];
  writeDemoNotifications(next);
  return next;
}

export function markNotificationRead(id: number) {
  const current = readDemoNotifications();
  const next = current.map((item) => (item.id === id ? { ...item, read: true } : item));
  writeDemoNotifications(next);
  return next;
}

export function markAllNotificationsRead(role: NotificationRole) {
  const current = readDemoNotifications();
  const next = current.map((item) =>
    item.role === role || item.role === "all" ? { ...item, read: true } : item
  );
  writeDemoNotifications(next);
  return next;
}
