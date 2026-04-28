"use client";

import { useEffect, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { MapPin, Star } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { CLINICS_MAP } from "@/data";
import type { Map as LeafletMap, Marker as LeafletMarker } from "leaflet";
import styles from "./MapSection.module.css";

export default function MapSection() {
  const t = useTranslations("map");
  const locale = useLocale();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<Record<number, LeafletMarker>>({});
  const sectionRef = useRef<HTMLDivElement>(null);

  const handleClinicClick = (clinic: typeof CLINICS_MAP[0]) => {
    const map = mapInstanceRef.current;
    const marker = markersRef.current[clinic.id];
    
    if (map && marker) {
      map.flyTo([clinic.lat, clinic.lng], 11, {
        duration: 1.2,
      });
      setTimeout(() => {
        marker.openPopup();
      }, 300);
    }
  };

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 100, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 100, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["1deg", "-1deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-1deg", "1deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  useEffect(() => {
    if (typeof window === "undefined" || !mapRef.current || mapInstanceRef.current) return;

    // Dynamic import to avoid SSR issues
    Promise.all([
      import("leaflet"),
      import("leaflet/dist/leaflet.css" as string),
    ])
      .then(([LModule]) => {
        const L = LModule.default;
        if (!mapRef.current || mapInstanceRef.current) return;
        const map = L.map(mapRef.current, {
          center: [39.0, 35.0],
          zoom: 5.5,
          zoomControl: false,
          scrollWheelZoom: false,
          attributionControl: false,
        });

        mapInstanceRef.current = map;

        L.tileLayer(
          "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
          {
            maxZoom: 19,
            subdomains: "abcd",
          }
        ).addTo(map);

        L.control.zoom({ position: "bottomright" }).addTo(map);

        CLINICS_MAP.forEach((clinic) => {
          const customIcon = L.divIcon({
            html: `<div style="
              width:40px;height:40px;
              background:linear-gradient(135deg, var(--primary), var(--primary-glow));
              border:2px solid rgba(255,255,255,0.3);
              border-radius:50% 50% 50% 0;
              transform:rotate(-45deg);
              box-shadow:0 4px 15px rgba(30,59,48,0.5);
              display:flex;align-items:center;justify-content:center;">
              <span style="transform:rotate(45deg);display:flex;
                align-items:center;justify-content:center;width:100%;height:100%;color:white;">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              </span>
            </div>`,
            className: "",
            iconSize: [40, 40],
            iconAnchor: [20, 40],
            popupAnchor: [0, -45],
          });

          const popupContent = `
            <div style="background:var(--bg-card);border:1px solid var(--border);
              border-radius:12px;padding:16px;min-width:220px;
              font-family: var(--font-sans); color:var(--text-primary);">
              <h3 style="font-size:14px;font-weight:700;margin-bottom:6px;">${clinic.name}</h3>
              <p style="font-size:12px;color:var(--text-secondary);margin-bottom:10px;display:flex;align-items:center;gap:4px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                ${clinic.location}
              </p>
              <div style="padding-top:10px; border-top:1px solid var(--border);display:flex;align-items:center;gap:4px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="var(--gold)" stroke="var(--gold)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                <span style="color:var(--gold);font-weight:700;font-size:13px;">${clinic.rating}</span>
              </div>
              <a href="/${locale}#clinics" style="display:block;margin-top:12px;padding:8px 16px;
                background:var(--primary);color:white;
                text-align:center;border-radius:999px;font-size:12px;font-weight:600;
                text-decoration:none;">${t("bookNow")}</a>
            </div>`;

          const marker = L.marker([clinic.lat, clinic.lng], { icon: customIcon })
            .addTo(map)
            .bindPopup(popupContent, { className: "", maxWidth: 260 });
          markersRef.current[clinic.id] = marker;
        });
      })
      .catch((error) => console.error(error));

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [locale, t]);

  return (
    <motion.section 
      className={`section ${styles.mapSection}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
    >
      <div className="container">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="section-badge"><MapPin size={16} style={{display: "inline", marginRight: "6px"}}/> {t("badge")}</div>
          <h2 className="section-title">
            {t("title").split(" ").slice(0, 2).join(" ")}{" "}
            <span>{t("title").split(" ").slice(2).join(" ")}</span>
          </h2>
          <p className="section-subtitle">{t("subtitle")}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, rotateX: 5, y: 40 }}
          whileInView={{ opacity: 1, scale: 1, rotateX: 0, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          style={{ perspective: "1200px" }}
        >
          <div className={styles.gridContainer}>
            <div className={styles.sidebar}>
              <div className={styles.legendTitle}>
                <MapPin size={18} />
                {t("legendTitle")}
              </div>
              <div className={styles.legendList}>
                {CLINICS_MAP.map((clinic) => (
                  <div 
                    key={clinic.id} 
                    className={styles.legendItem}
                    onClick={() => handleClinicClick(clinic)}
                  >
                    <div className={styles.legendDot} />
                    <div className={styles.legendInfo}>
                      <div className={styles.legendName}>{clinic.name}</div>
                      <div className={styles.legendCity}>{clinic.location}</div>
                    </div>
                    <span className={styles.legendRating} style={{display: "flex", alignItems: "center", gap: "4px"}}>
                      <Star size={14} fill="var(--gold)" color="var(--gold)" /> {clinic.rating}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <motion.div 
              ref={sectionRef}
              className={styles.mapWrapper}
              style={{ transformStyle: "preserve-3d", rotateX, rotateY }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <div ref={mapRef} className={styles.map} id="clinic-map" style={{ transform: "translateZ(0)" }} />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
