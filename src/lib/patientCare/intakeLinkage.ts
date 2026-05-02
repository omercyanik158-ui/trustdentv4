import type { AppointmentIntakeSnapshot, RadiologyIntakeLinkFields } from "@/domain/patientCare";

/** Pure: map appointment snapshot → radiology persistence fields. */
export function radiologyFieldsFromIntakeSnapshot(
  snapshot: AppointmentIntakeSnapshot | null | undefined
): RadiologyIntakeLinkFields {
  if (!snapshot) {
    return {};
  }
  return {
    intakeSummary: snapshot.intakeSummary,
    linkedAppointmentId: snapshot.appointmentId,
  };
}
