"use client";

import React, { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  Stethoscope,
  Sparkles,
  Diamond,
  Zap,
  Activity,
  CheckCircle,
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import styles from "./Treatments.module.css";

const TREATMENTS = [
  {
    id: "implants",
    icon: Stethoscope,
    color: "#BC0A18",
    angle: 0
  },
  {
    id: "veneers",
    icon: Sparkles,
    color: "#D4AF37",
    angle: 52
  },
  {
    id: "zirconia",
    icon: Diamond,
    color: "#FDFDFF",
    angle: 128
  },
  {
    id: "whitening",
    icon: Zap,
    color: "#E8333F",
    angle: 180
  },
  {
    id: "orthodontics",
    icon: Activity,
    color: "#7F0000",
    angle: 232
  },
  {
    id: "root-canal",
    icon: ShieldCheck,
    color: "#c0c0c8",
    angle: 308
  },
];

export default function Treatments({ scrollAnimated = true }: { scrollAnimated?: boolean }) {
  const t = useTranslations("treatments");
  const [activeId, setActiveId] = useState(TREATMENTS[0].id);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center center"],
  });

  const radius = scrollAnimated ? useTransform(scrollYProgress, [0, 1], [0, 300]) : undefined;
  const opacity = scrollAnimated ? useTransform(scrollYProgress, [0, 0.5], [0, 1]) : undefined;
  const rotation = scrollAnimated ? useTransform(scrollYProgress, [0, 1], [-90, 0]) : undefined;

  const activeTreatment = TREATMENTS.find(t => t.id === activeId) || TREATMENTS[0];

  return (
    <section className={`section ${styles.treatments}`} ref={containerRef}>
      <div className="container">
        <div className="section-header">
          <div className="section-badge">{t("badge")}</div>
          <h2 className="section-title">{t("titleMain")} <span>{t("titleSpan")}</span></h2>
          <p className="section-subtitle">
            {t("description")}
          </p>
        </div>

        <div className={styles.constellationWrapper}>
          {/* Central Active View */}
          <div className={styles.centralOrbit}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeId}
                initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 1.2, rotateY: 30 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className={styles.activeContent}
              >
                <div
                  className={styles.activeIcon}
                  style={{ color: activeTreatment.color, backgroundColor: `${activeTreatment.color}15` }}
                >
                  <activeTreatment.icon size={56} strokeWidth={1.5} />
                </div>
                <h3 className={styles.activeTitle}>{t(`${activeId}.title`)}</h3>
                <p className={styles.activeDesc}>{t(`${activeId}.description`)}</p>
                <button className="btn btn-primary btn-sm">
                  {t("btnExplore")}
                  <ChevronRight size={14} />
                </button>
              </motion.div>
            </AnimatePresence>

            {/* Pulsing Orbits */}
            <div className={styles.orbitRing1} />
            <div className={styles.orbitRing2} />
          </div>

          {/* Satellite Constellation */}
          <motion.div
            className={styles.satellites}
            style={
              scrollAnimated
                ? ({ rotate: rotation, opacity } as any)
                : undefined
            }
            initial={scrollAnimated ? undefined : { opacity: 0, scale: 0.98, y: 10 }}
            animate={scrollAnimated ? undefined : { opacity: 1, scale: 1, y: 0 }}
            transition={scrollAnimated ? undefined : { duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            {TREATMENTS.map((item, index) => (
              <SatelliteItem
                key={item.id}
                item={item}
                activeId={activeId}
                setActiveId={setActiveId}
                t={t}
                radius={radius}
                scrollAnimated={scrollAnimated}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function SatelliteItem({ item, activeId, setActiveId, radius, scrollAnimated, t }: any) {
  const x = scrollAnimated
    ? useTransform(radius, (r: number) => Math.cos((item.angle * Math.PI) / 180) * r)
    : Math.cos((item.angle * Math.PI) / 180) * 300;
  const y = scrollAnimated
    ? useTransform(radius, (r: number) => Math.sin((item.angle * Math.PI) / 180) * (r * 0.9))
    : Math.sin((item.angle * Math.PI) / 180) * (300 * 0.9);

  return (
    <motion.button
      className={`${styles.satellite} ${activeId === item.id ? styles.activeSatellite : ""}`}
      onClick={() => setActiveId(item.id)}
      style={{
        x,
        y,
        "--color": item.color
      } as any}
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.9 }}
      initial={scrollAnimated ? undefined : { opacity: 0, scale: 0.9 }}
      animate={scrollAnimated ? undefined : { opacity: 1, scale: 1 }}
      transition={scrollAnimated ? undefined : { duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      <item.icon size={20} strokeWidth={2} />
      <span className={styles.satelliteLabel}>{t(`${item.id}.title`)}</span>
    </motion.button>
  );
}
