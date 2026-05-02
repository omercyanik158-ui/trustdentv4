import { Activity, Diamond, ShieldCheck, Sparkles, Stethoscope, Zap } from "lucide-react";
import type { TreatmentMeta } from "./types";

/**
 * Visual metadata for treatments shown on the constellation.
 *
 * Translated text (title/description) lives in `messages/*.json` under the
 * `treatments.<id>.*` path and is resolved at render time via `useTranslations`.
 */
export const TREATMENTS: TreatmentMeta[] = [
  { id: "implants",     icon: Stethoscope, color: "#BC0A18", angle: 0   },
  { id: "veneers",      icon: Sparkles,    color: "#D4AF37", angle: 52  },
  { id: "zirconia",     icon: Diamond,     color: "#FDFDFF", angle: 128 },
  { id: "whitening",    icon: Zap,         color: "#E8333F", angle: 180 },
  { id: "orthodontics", icon: Activity,    color: "#7F0000", angle: 232 },
  { id: "root-canal",   icon: ShieldCheck, color: "#c0c0c8", angle: 308 },
];
