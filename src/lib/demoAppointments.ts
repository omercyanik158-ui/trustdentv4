export const DEMO_APPOINTMENTS_KEY = "trustdent_appointments";

export type AppointmentStatus = "pending" | "inProgress" | "approved" | "cancelled" | "completed";

export type DemoAppointment = {
  id: number;
  patient: string;
  treatment: string;
  clinic: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  createdAt: string;
};

const DEFAULT_APPOINTMENTS: DemoAppointment[] = [
  {
    id: 1001,
    patient: "Ahmet Yılmaz",
    treatment: "İmplant Kontrolü",
    clinic: "DentaLux İstanbul",
    date: "2026-04-29",
    time: "09:00",
    status: "pending",
    createdAt: "2026-04-28T08:30:00.000Z",
  },
  {
    id: 1002,
    patient: "Sarah Miller",
    treatment: "Zirkonyum Kaplama",
    clinic: "Smile Clinic Antalya",
    date: "2026-04-29",
    time: "10:30",
    status: "inProgress",
    createdAt: "2026-04-28T09:00:00.000Z",
  },
  {
    id: 1003,
    patient: "Ali Vefa",
    treatment: "Kanal Tedavisi",
    clinic: "Istanbul Dental Center",
    date: "2026-04-30",
    time: "13:00",
    status: "approved",
    createdAt: "2026-04-28T09:45:00.000Z",
  },
];

const LEGACY_STATUS_MAP: Record<string, AppointmentStatus> = {
  "Onay Bekliyor": "pending",
  Onaylandı: "approved",
  İptal: "cancelled",
  Tamamlandı: "completed",
  pending: "pending",
  inProgress: "inProgress",
  approved: "approved",
  cancelled: "cancelled",
  completed: "completed",
};

function normalizeStatus(status: unknown): AppointmentStatus {
  if (typeof status === "string" && LEGACY_STATUS_MAP[status]) {
    return LEGACY_STATUS_MAP[status];
  }
  return "pending";
}

function normalizeAppointment(input: Partial<DemoAppointment> & { id?: number }): DemoAppointment {
  return {
    id: typeof input.id === "number" ? input.id : Date.now(),
    patient: input.patient?.trim() || "Demo Hasta",
    treatment: input.treatment?.trim() || "Genel Muayene",
    clinic: input.clinic?.trim() || "Farketmez",
    date: input.date?.trim() || new Date().toISOString().slice(0, 10),
    time: input.time?.trim() || "09:00",
    status: normalizeStatus(input.status),
    createdAt: input.createdAt || new Date().toISOString(),
  };
}

export function readDemoAppointments(): DemoAppointment[] {
  if (typeof window === "undefined") {
    return DEFAULT_APPOINTMENTS;
  }

  const raw = localStorage.getItem(DEMO_APPOINTMENTS_KEY);
  if (!raw) {
    return DEFAULT_APPOINTMENTS;
  }

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return DEFAULT_APPOINTMENTS;
    }
    return parsed.map((item) => normalizeAppointment(item as Partial<DemoAppointment>));
  } catch {
    return DEFAULT_APPOINTMENTS;
  }
}

export function writeDemoAppointments(appointments: DemoAppointment[]) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    DEMO_APPOINTMENTS_KEY,
    JSON.stringify(appointments.map((item) => normalizeAppointment(item)))
  );
}

export function seedDemoAppointments(force = false): DemoAppointment[] {
  if (typeof window === "undefined") {
    return DEFAULT_APPOINTMENTS;
  }

  const current = readDemoAppointments();
  if (current.length > 0 && !force) {
    return current;
  }

  writeDemoAppointments(DEFAULT_APPOINTMENTS);
  return DEFAULT_APPOINTMENTS;
}

export function resetDemoAppointments(): DemoAppointment[] {
  return seedDemoAppointments(true);
}
