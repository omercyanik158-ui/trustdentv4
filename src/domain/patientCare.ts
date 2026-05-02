/**
 * Domain model for “başvuru bağlamı”: booking intake ↔ radiology ↔ doctor views.
 *
 * Future HTTP shape (reference only):
 * - GET  /api/patients/:patientId/care-context/latest
 * - GET  /api/patients/:patientId/radiology
 * - POST /api/patients/:patientId/radiology  { appointmentId?, file, title?, notes? }
 *
 * Demo code maps these concepts onto localStorage; swap the repository implementation for fetch().
 */

/** Aligns with appointment / booking request lifecycle. */
export type CareRequestStatus =
  | "pending"
  | "inProgress"
  | "approved"
  | "cancelled"
  | "completed";

/**
 * Minimal intake snapshot copied onto radiology rows so clinicians see context
 * before approving the visit (immutable snapshot at upload time).
 */
export type AppointmentIntakeSnapshot = {
  appointmentId: number;
  intakeSummary?: string;
  treatment: string;
  clinic: string;
  status: CareRequestStatus;
  createdAt: string;
};

/** Fields persisted on a radiology artifact (demo: DemoRadiologyRecord). */
export type RadiologyIntakeLinkFields = {
  intakeSummary?: string;
  linkedAppointmentId?: number;
};

/** Payload for creating a radiology upload (minus generated server fields). */
export type CreateRadiologyArtifactInput = {
  patientRecordId: string;
  patientDisplayName: string;
  title: string;
  notes: string;
  fileName: string;
  mimeType: string;
  sizeKb: number;
  previewDataUrl: string;
  /** Resolved server-side in production from active booking / case. */
  intakeLink?: RadiologyIntakeLinkFields | null;
};
