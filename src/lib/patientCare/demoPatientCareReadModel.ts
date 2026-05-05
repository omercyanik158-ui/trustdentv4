import type { AppointmentIntakeSnapshot, RadiologyIntakeLinkFields } from "@/domain/patientCare";
import { findLatestAppointmentContextForPatient } from "@/lib/demoAppointments";
import type { PatientCareReadModel } from "@/lib/patientCare/patientCareReadModel";

/** Maps appointment snapshot → radiology row fields (demo localStorage). */
export function radiologyFieldsFromAppointmentSnapshot(
  snapshot: AppointmentIntakeSnapshot | null | undefined
): RadiologyIntakeLinkFields {
  if (!snapshot) return {};
  return {
    intakeSummary: snapshot.intakeSummary,
    linkedAppointmentId: snapshot.appointmentId,
  };
}

/** Demo implementation — swap for HTTP-backed ReadModel when wiring a real API. */
export const demoPatientCareReadModel: PatientCareReadModel = {
  getLatestAppointmentIntakeSnapshot(input) {
    return findLatestAppointmentContextForPatient(
      input.patientDisplayName,
      input.patientRecordId ?? undefined
    );
  },
};
