import type { Testimonial } from "./types";

/**
 * Testimonials shown on the homepage.
 *
 * The `key` field maps to the i18n namespace `testimonials.<key>.*` for the
 * actual text/treatment/date so reviews translate per locale.
 */
export const TESTIMONIALS: Testimonial[] = [
  { id: 1, name: "James Mitchell",    country: "🇬🇧 United Kingdom", avatar: "JM", rating: 5, key: "review1" },
  { id: 2, name: "Hans Weber",        country: "🇩🇪 Deutschland",    avatar: "HW", rating: 5, key: "review2" },
  { id: 3, name: "Fatima Al-Rashid",  country: "🇸🇦 Saudi Arabia",   avatar: "FA", rating: 5, key: "review3" },
  { id: 4, name: "Mehmet Yılmaz",     country: "🇹🇷 Türkiye",         avatar: "MY", rating: 5, key: "review4" },
  { id: 5, name: "Sofia Rossi",       country: "🇮🇹 Italia",         avatar: "SR", rating: 5, key: "review5" },
  { id: 6, name: "Noah Williams",     country: "🇺🇸 United States",  avatar: "NW", rating: 5, key: "review6" },
];
