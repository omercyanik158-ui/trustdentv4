import { sanitizeEmail, sanitizePhone, sanitizeText } from "@/lib/security";

export const PROFILE_KEY = "trustdent_patient_profile";
export const PREFS_KEY = "trustdent_patient_prefs";

export type PatientProfile = {
  fullName: string;
  email: string;
  phone: string;
};

export type PatientPreferences = {
  sms: boolean;
  email: boolean;
  vip: boolean;
};

const DEFAULT_PROFILE: PatientProfile = {
  fullName: "Ahmet Yılmaz",
  email: "ahmet@example.com",
  phone: "+90 555 123 4567",
};

const DEFAULT_PREFS: PatientPreferences = {
  sms: true,
  email: true,
  vip: false,
};

export function readPatientProfile(): PatientProfile {
  if (typeof window === "undefined") return DEFAULT_PROFILE;
  const raw = localStorage.getItem(PROFILE_KEY);
  if (!raw) return DEFAULT_PROFILE;
  try {
    const parsed = JSON.parse(raw) as Partial<PatientProfile>;
    return {
      fullName: sanitizeText(parsed.fullName || DEFAULT_PROFILE.fullName, 80),
      email: sanitizeEmail(parsed.email || DEFAULT_PROFILE.email),
      phone: sanitizePhone(parsed.phone || DEFAULT_PROFILE.phone),
    };
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function writePatientProfile(profile: PatientProfile) {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    PROFILE_KEY,
    JSON.stringify({
      fullName: sanitizeText(profile.fullName, 80),
      email: sanitizeEmail(profile.email),
      phone: sanitizePhone(profile.phone),
    })
  );
}

export function readPatientPreferences(): PatientPreferences {
  if (typeof window === "undefined") return DEFAULT_PREFS;
  const raw = localStorage.getItem(PREFS_KEY);
  if (!raw) return DEFAULT_PREFS;
  try {
    const parsed = JSON.parse(raw) as Partial<PatientPreferences>;
    return {
      sms: Boolean(parsed.sms),
      email: Boolean(parsed.email),
      vip: Boolean(parsed.vip),
    };
  } catch {
    return DEFAULT_PREFS;
  }
}

export function writePatientPreferences(prefs: PatientPreferences) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
}

export function resetPatientProfileStore() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(PROFILE_KEY);
  localStorage.removeItem(PREFS_KEY);
}
