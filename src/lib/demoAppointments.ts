import type { TreatmentId } from "@/data/types";
import type { AppointmentIntakeSnapshot, CareRequestStatus } from "@/domain/patientCare";
import { resolveClinicSlug, resolveTreatmentId } from "@/lib/appointmentLocalization";

export const DEMO_APPOINTMENTS_KEY = "trustdent_appointments";
const DEMO_APPOINTMENTS_VERSION = 1;

/** @deprecated Import CareRequestStatus from @/domain/patientCare where possible */
export type AppointmentStatus = CareRequestStatus;

export type DemoAppointment = {
  id: number;
  /** Future FK to auth user / EMR patient — demo uses `patient-demo-1`. */
  patientRecordId?: string | null;
  patient: string;
  treatmentId: TreatmentId;
  clinicSlug: string | null;
  treatment: string;
  clinic: string;
  date: string;
  time: string;
  intakeSummary?: string;
  status: AppointmentStatus;
  createdAt: string;
};

type DemoAppointmentsStore = {
  version: number;
  data: DemoAppointment[];
};

const DEFAULT_APPOINTMENTS: DemoAppointment[] = [
  {
    id: 1001,
    patient: "Ahmet Yılmaz",
    treatmentId: "implants",
    clinicSlug: "dentalux-istanbul",
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
    treatmentId: "zirconia",
    clinicSlug: "smile-clinic-antalya",
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
    treatmentId: "root-canal",
    clinicSlug: "istanbul-dental-center",
    treatment: "Kanal Tedavisi",
    clinic: "Istanbul Dental Center",
    date: "2026-04-30",
    time: "13:00",
    status: "approved",
    createdAt: "2026-04-28T09:45:00.000Z",
  },
];

const LEGACY_STATUS_MAP: Record<string, CareRequestStatus> = {
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

function normalizeStatus(status: unknown): CareRequestStatus {
  if (typeof status === "string" && LEGACY_STATUS_MAP[status]) {
    return LEGACY_STATUS_MAP[status];
  }
  return "pending";
}

function normalizeAppointment(input: Partial<DemoAppointment> & { id?: number }): DemoAppointment {
  const treatmentId = resolveTreatmentId(input.treatmentId ?? input.treatment);
  const clinicSlug = resolveClinicSlug(input.clinicSlug ?? input.clinic);
  return {
    id: typeof input.id === "number" ? input.id : Date.now(),
    patientRecordId:
      typeof input.patientRecordId === "string"
        ? input.patientRecordId.trim().slice(0, 64) || null
        : input.patientRecordId === null
          ? null
          : undefined,
    patient: input.patient?.trim() || "Demo Hasta",
    treatmentId,
    clinicSlug,
    treatment: input.treatment?.trim() || "General Consultation",
    clinic: input.clinic?.trim() || "",
    date: input.date?.trim() || new Date().toISOString().slice(0, 10),
    time: input.time?.trim() || "09:00",
    intakeSummary: typeof input.intakeSummary === "string" ? input.intakeSummary.trim().slice(0, 260) : undefined,
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
    if (Array.isArray(parsed)) {
      // Legacy storage shape: plain array.
      return parsed.map((item) => normalizeAppointment(item as Partial<DemoAppointment>));
    }
    if (!parsed || typeof parsed !== "object" || !Array.isArray((parsed as DemoAppointmentsStore).data)) {
      return DEFAULT_APPOINTMENTS;
    }
    const store = parsed as DemoAppointmentsStore;
    return store.data.map((item) => normalizeAppointment(item as Partial<DemoAppointment>));
  } catch {
    return DEFAULT_APPOINTMENTS;
  }
}

export function writeDemoAppointments(appointments: DemoAppointment[]) {
  if (typeof window === "undefined") {
    return;
  }

  const store: DemoAppointmentsStore = {
    version: DEMO_APPOINTMENTS_VERSION,
    data: appointments.map((item) => normalizeAppointment(item)),
  };
  localStorage.setItem(DEMO_APPOINTMENTS_KEY, JSON.stringify(store));
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

/** Loose match for demo patient names across locales / keyboard variants. */
export function patientNamesLikelyMatch(a: string, b: string): boolean {
  const norm = (s: string) =>
    s
      .trim()
      .toLowerCase()
      .replace(/ı/g, "i")
      .replace(/İ/g, "i")
      .replace(/ğ/g, "g")
      .replace(/ü/g, "u")
      .replace(/ş/g, "s")
      .replace(/ö/g, "o")
      .replace(/ç/g, "c")
      .replace(/\s+/g, " ");
  return norm(a) === norm(b);
}

export function findLatestAppointmentContextForPatient(
  patientDisplayName: string,
  patientRecordId?: string | null
): AppointmentIntakeSnapshot | null {
  const appointments = readDemoAppointments();
  let pool = appointments;

  if (patientRecordId) {
    const scoped = appointments.filter((a) => a.patientRecordId === patientRecordId);
    if (scoped.length > 0) {
      pool = scoped;
    }
  }

  const candidates = pool.filter((apt) => patientNamesLikelyMatch(apt.patient, patientDisplayName));
  if (candidates.length === 0) return null;
  candidates.sort((x, y) => y.createdAt.localeCompare(x.createdAt));
  const latest = candidates[0];
  return {
    appointmentId: latest.id,
    intakeSummary: latest.intakeSummary,
    treatment: latest.treatment,
    clinic: latest.clinic,
    status: latest.status,
    createdAt: latest.createdAt,
  };
}
