import { findLatestAppointmentContextForPatient } from "@/lib/demoAppointments";
import type { PatientCareReadModel } from "@/lib/patientCare/patientCareReadModel";

/** Demo implementation — swap for HTTP-backed ReadModel when wiring a real API. */
export const demoPatientCareReadModel: PatientCareReadModel = {
  getLatestAppointmentIntakeSnapshot(input) {
    return findLatestAppointmentContextForPatient(
      input.patientDisplayName,
      input.patientRecordId ?? undefined
    );
  },
};
