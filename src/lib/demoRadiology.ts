import { sanitizeText } from "@/lib/security";
import { DEMO_PATIENT_RECORD_ID } from "@/lib/demo/demoPatient";

export const DEMO_RADIOLOGY_KEY = "trustdent_radiology";
const DEMO_RADIOLOGY_VERSION = 1;
const SAFE_DATA_URL_REGEX = /^data:image\/(?:jpeg|png|webp);base64,[a-z0-9+/=]+$/i;

export type RadiologyStatus = "new" | "reviewed";

export type DemoRadiologyRecord = {
  id: number;
  patientId: string;
  patientName: string;
  title: string;
  notes: string;
  /** Snapshot from booking intake at upload time (doctor sees before approving visit). */
  intakeSummary?: string;
  linkedAppointmentId?: number;
  fileName: string;
  mimeType: string;
  sizeKb: number;
  previewDataUrl: string;
  uploadedAt: string;
  doctorNote: string;
  status: RadiologyStatus;
};

type DemoRadiologyStore = {
  version: number;
  data: DemoRadiologyRecord[];
};

const DEFAULT_RECORDS: DemoRadiologyRecord[] = [];

function normalizeStatus(input: unknown): RadiologyStatus {
  return input === "reviewed" ? "reviewed" : "new";
}

function normalizeRecord(input: Partial<DemoRadiologyRecord> & { id?: number }): DemoRadiologyRecord {
  const rawPreview = typeof input.previewDataUrl === "string" ? input.previewDataUrl.trim() : "";
  return {
    id: typeof input.id === "number" ? input.id : Date.now(),
    patientId: sanitizeText(input.patientId || DEMO_PATIENT_RECORD_ID, 40),
    patientName: sanitizeText(input.patientName || "Demo Patient", 80),
    title: sanitizeText(input.title || "X-ray", 120),
    notes: sanitizeText(input.notes || "", 400),
    intakeSummary:
      typeof input.intakeSummary === "string" ? sanitizeText(input.intakeSummary, 260) : undefined,
    linkedAppointmentId:
      typeof input.linkedAppointmentId === "number" ? input.linkedAppointmentId : undefined,
    fileName: sanitizeText(input.fileName || "xray.jpg", 140),
    mimeType: sanitizeText(input.mimeType || "image/jpeg", 80),
    sizeKb: typeof input.sizeKb === "number" ? input.sizeKb : 0,
    previewDataUrl: SAFE_DATA_URL_REGEX.test(rawPreview) ? rawPreview : "",
    uploadedAt: input.uploadedAt || new Date().toISOString(),
    doctorNote: sanitizeText(input.doctorNote || "", 500),
    status: normalizeStatus(input.status),
  };
}

export function readDemoRadiology(): DemoRadiologyRecord[] {
  if (typeof window === "undefined") return DEFAULT_RECORDS;
  const raw = localStorage.getItem(DEMO_RADIOLOGY_KEY);
  if (!raw) return DEFAULT_RECORDS;

  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.map((item) => normalizeRecord(item as Partial<DemoRadiologyRecord>));
    }
    if (!parsed || typeof parsed !== "object" || !Array.isArray((parsed as DemoRadiologyStore).data)) {
      return DEFAULT_RECORDS;
    }
    return (parsed as DemoRadiologyStore).data.map((item) => normalizeRecord(item));
  } catch {
    return DEFAULT_RECORDS;
  }
}

export function writeDemoRadiology(records: DemoRadiologyRecord[]) {
  if (typeof window === "undefined") return;
  const store: DemoRadiologyStore = {
    version: DEMO_RADIOLOGY_VERSION,
    data: records.map((item) => normalizeRecord(item)),
  };
  localStorage.setItem(DEMO_RADIOLOGY_KEY, JSON.stringify(store));
}

export function seedDemoRadiology(force = false): DemoRadiologyRecord[] {
  if (typeof window === "undefined") return DEFAULT_RECORDS;
  const current = readDemoRadiology();
  if (!force && current.length > 0) return current;
  writeDemoRadiology(DEFAULT_RECORDS);
  return DEFAULT_RECORDS;
}

export function resetDemoRadiology() {
  return seedDemoRadiology(true);
}

export function isSafeRadiologyPreviewUrl(value: string): boolean {
  return SAFE_DATA_URL_REGEX.test(value.trim());
}

export function createRadiologyRecord(
  input: Omit<DemoRadiologyRecord, "id" | "uploadedAt" | "status" | "doctorNote">
) {
  return normalizeRecord({
    ...input,
    id: Date.now(),
    uploadedAt: new Date().toISOString(),
    status: "new",
    doctorNote: "",
  });
}
