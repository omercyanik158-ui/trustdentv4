/**
 * Domain types for TrustDent.
 *
 * These types describe the shape of data consumed by UI components.
 * When the backend (Prisma + API routes) is wired up, the same types
 * can be reused so swapping mock data for real data is a single-file change.
 */

import type { LucideIcon } from "lucide-react";

export type TreatmentId =
  | "implants"
  | "veneers"
  | "zirconia"
  | "whitening"
  | "orthodontics"
  | "root-canal"
  | "full-mouth";

export type ClinicBadgeKey =
  | "badgeMostPreferred"
  | "badgeJci"
  | "badgeNewlyOpened"
  | "badgePremium";

export interface Clinic {
  id: number;
  slug: string;
  name: string;
  city: string;
  district: string;
  /** Rendered location label, e.g. "Şişli, İstanbul" */
  location: string;
  rating: number;
  reviews: number;
  specialties: TreatmentId[];
  blurb: string;
  verified: boolean;
  badgeKey: ClinicBadgeKey | null;
  badgeColor: string | null;
  lat: number;
  lng: number;
}

export interface Doctor {
  id: number;
  name: string;
  initials: string;
  title: string;
  clinicId: number;
  clinicName: string;
  rating: number;
  reviews: number;
  review: string;
  /** Optional avatar URL (falls back to initials if absent). */
  photoUrl?: string;
}

export interface TreatmentMeta {
  id: TreatmentId;
  icon: LucideIcon;
  color: string;
  /** Position angle (degrees) on the constellation orbit. */
  angle: number;
}

export interface Testimonial {
  id: number;
  name: string;
  /** Country flag + name, e.g. "🇬🇧 United Kingdom". */
  country: string;
  avatar: string;
  rating: number;
  /** i18n key under `testimonials.*` namespace. */
  key: string;
}
