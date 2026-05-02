import type { MetadataRoute } from "next";

const BASE_URL = "https://trustdent.com";
const LOCALES = ["tr", "en", "de", "es"] as const;
const ROUTES = ["", "/about", "/clinics", "/doctors", "/treatments"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return LOCALES.flatMap((locale) =>
    ROUTES.map((route) => ({
      url: `${BASE_URL}/${locale}${route}`,
      lastModified: now,
      changeFrequency: route === "" ? "daily" : "weekly",
      priority: route === "" ? 1 : 0.8,
    }))
  );
}
