import type { AppointmentIntakeSnapshot } from "@/domain/patientCare";

/**
 * Read-model for linking radiology uploads to booking context.
 * Demo: synchronous localStorage. Production: async fetch + React Query / server components.
 */
export type PatientCareReadModel = {
  getLatestAppointmentIntakeSnapshot(input: {
    patientRecordId?: string | null;
    patientDisplayName: string;
  }): AppointmentIntakeSnapshot | null;
};
