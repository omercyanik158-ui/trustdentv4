import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TrustDent",
    short_name: "TrustDent",
    description: "Dental tourism platform for clinics, doctors and patients.",
    start_url: "/tr",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#BC0A18",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
