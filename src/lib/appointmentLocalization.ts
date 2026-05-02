import { CLINICS } from "@/data/clinics";
import type { TreatmentId } from "@/data/types";
import type { DemoAppointment } from "@/lib/demoAppointments";

const FALLBACK_TREATMENT: TreatmentId = "implants";

const TREATMENT_ALIASES: Record<string, TreatmentId> = {
  implants: "implants",
  implant: "implants",
  "dental implants": "implants",
  "dis implanti": "implants",
  "diş implantı": "implants",
  implantes: "implants",
  implantate: "implants",
  veneers: "veneers",
  veneer: "veneers",
  "porcelain veneers": "veneers",
  lamine: "veneers",
  "porselen lamine": "veneers",
  carillas: "veneers",
  verblendschalen: "veneers",
  zirconia: "zirconia",
  "zirconia crowns": "zirconia",
  "zirkonyum kaplama": "zirconia",
  coronas: "zirconia",
  zirkon: "zirconia",
  whitening: "whitening",
  "teeth whitening": "whitening",
  "dis beyazlatma": "whitening",
  "diş beyazlatma": "whitening",
  blanqueamiento: "whitening",
  aufhellung: "whitening",
  orthodontics: "orthodontics",
  ortodonti: "orthodontics",
  ortodoncia: "orthodontics",
  kieferorthopadie: "orthodontics",
  kieferorthopädie: "orthodontics",
  "root-canal": "root-canal",
  "root canal": "root-canal",
  "kanal tedavisi": "root-canal",
  "tratamiento de conducto": "root-canal",
  wurzelkanal: "root-canal",
  "full-mouth": "full-mouth",
  "full mouth": "full-mouth",
  "full mouth restoration": "full-mouth",
  "tum agiz restorasyon": "full-mouth",
  "tüm ağız restorasyon": "full-mouth",
  "restauracion completa": "full-mouth",
  "komplette restaurierung": "full-mouth",
};

export function normalizeSearchValue(value: string, locale: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase(locale)
    .trim();
}

export function resolveTreatmentId(value?: string | null): TreatmentId {
  const normalized = normalizeSearchValue(value ?? "", "en");
  return TREATMENT_ALIASES[normalized] ?? FALLBACK_TREATMENT;
}

export function resolveClinicSlug(value?: string | null): string | null {
  const normalized = normalizeSearchValue(value ?? "", "tr");
  if (!normalized) return null;

  const matched = CLINICS.find((clinic) => {
    const slug = normalizeSearchValue(clinic.slug, "tr");
    const name = normalizeSearchValue(clinic.name, "tr");
    const location = normalizeSearchValue(clinic.location, "tr");
    return normalized === slug || normalized === name || normalized === location;
  });
  return matched?.slug ?? null;
}

export function getClinicNameBySlug(slug?: string | null): string | null {
  if (!slug) return null;
  return CLINICS.find((clinic) => clinic.slug === slug)?.name ?? null;
}

export function formatLocaleDate(date: string, locale: string): string {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    return date;
  }
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(parsed);
}

type Translate = (key: string) => string;

export function getAppointmentLabels(
  appointment: DemoAppointment,
  locale: string,
  translateTreatment: Translate,
  clinicFallbackLabel: string
) {
  const treatmentId = resolveTreatmentId(appointment.treatmentId ?? appointment.treatment);
  const clinicSlug = resolveClinicSlug(appointment.clinicSlug ?? appointment.clinic);
  const treatmentLabel = translateTreatment(`${treatmentId}.title`);
  const clinicLabel = getClinicNameBySlug(clinicSlug) || appointment.clinic || clinicFallbackLabel;
  const dateLabel = formatLocaleDate(appointment.date, locale);

  return {
    treatmentId,
    clinicSlug,
    treatmentLabel,
    clinicLabel,
    dateLabel,
  };
}
