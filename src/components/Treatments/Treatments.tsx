"use client";

import React, { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import type { MotionStyle, MotionValue } from "framer-motion";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { TREATMENTS } from "@/data";
import type { TreatmentId, TreatmentMeta } from "@/data";
import styles from "./Treatments.module.css";

export default function Treatments({ scrollAnimated = true }: { scrollAnimated?: boolean }) {
  const t = useTranslations("treatments");
  const [activeId, setActiveId] = useState(TREATMENTS[0].id);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center center"],
  });

  // Hooks must stay unconditional; we choose which MotionValue to use below.
  const animatedRadius = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const staticRadius = useTransform(scrollYProgress, [0, 1], [300, 300]);
  const animatedOpacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const staticOpacity = useTransform(scrollYProgress, [0, 1], [1, 1]);
  const animatedRotation = useTransform(scrollYProgress, [0, 1], [-90, 0]);
  const staticRotation = useTransform(scrollYProgress, [0, 1], [0, 0]);

  const radius = scrollAnimated ? animatedRadius : staticRadius;
  const opacity = scrollAnimated ? animatedOpacity : staticOpacity;
  const rotation = scrollAnimated ? animatedRotation : staticRotation;

  const activeTreatment = TREATMENTS.find(t => t.id === activeId) || TREATMENTS[0];

  return (
    <section className={`section ${styles.treatments}`} ref={containerRef}>
      <div className="container">
        <div className="section-header" style={{ marginBottom: "0rem" }}>
          <div className="section-badge">{t("badge")}</div>
          <h2 className="section-title">{t("titleMain")} <span>{t("titleSpan")}</span></h2>
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
            style={{ rotate: rotation, opacity }}
            initial={scrollAnimated ? undefined : { opacity: 0, scale: 0.98, y: 10 }}
            animate={scrollAnimated ? undefined : { opacity: 1, scale: 1, y: 0 }}
            transition={scrollAnimated ? undefined : { duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            {TREATMENTS.map((item) => (
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

type SatelliteItemProps = {
  item: TreatmentMeta;
  activeId: TreatmentId;
  setActiveId: React.Dispatch<React.SetStateAction<TreatmentId>>;
  radius: MotionValue<number>;
  scrollAnimated: boolean;
  t: ReturnType<typeof useTranslations>;
};

function SatelliteItem({ item, activeId, setActiveId, radius, scrollAnimated, t }: SatelliteItemProps) {
  const x = useTransform(radius, (r: number) => Math.cos((item.angle * Math.PI) / 180) * r);
  const y = useTransform(radius, (r: number) => Math.sin((item.angle * Math.PI) / 180) * (r * 0.9));

  const satelliteStyle: MotionStyle & { "--color": string } = {
    x,
    y,
    "--color": item.color,
  };

  return (
    <motion.button
      className={`${styles.satellite} ${activeId === item.id ? styles.activeSatellite : ""}`}
      onClick={() => setActiveId(item.id)}
      style={satelliteStyle}
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
