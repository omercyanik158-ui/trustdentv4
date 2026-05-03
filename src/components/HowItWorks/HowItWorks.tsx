"use client";

import React, { useId, useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { TbPlaneArrival, TbStethoscope, TbHotelService, TbConfetti } from "react-icons/tb";
import styles from "./HowItWorks.module.css";

const PATH_D = "M 50 0 Q 80 200 50 400 Q 20 600 50 800";

const JOURNEY_STEPS = [
  { id: "step1", icon: TbPlaneArrival, color: "#BC0A18" },
  { id: "step2", icon: TbStethoscope, color: "#E8333F" },
  { id: "step3", icon: TbHotelService, color: "#D4AF37" },
  { id: "step4", icon: TbConfetti, color: "#FDFDFF" },
];

export default function HowItWorks() {
  const t = useTranslations("howItWorks");
  const filterUid = useId().replace(/:/g, "");
  const prefersReducedMotion = useReducedMotion();
  const reducedMotion = prefersReducedMotion === true;
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const primaryDraw = useTransform(scrollYProgress, [0.04, 0.88], [0, 1]);
  const trailDraw = useTransform(scrollYProgress, [0.14, 0.94], [0, 1]);
  const accentDraw = useTransform(scrollYProgress, [0.2, 0.9], [0, 1]);

  const glowFilterId = `hiw-glow-${filterUid}`;

  return (
    <section className={`section ${styles.journey}`} ref={containerRef}>
      <div className="container">
        <motion.div
          className="section-header"
          initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="section-badge">{t("badge")}</div>
          <h2 className="section-title">
            {t("titleMain")} <span>{t("titleSpan")}</span> {t("titleEnd")}
          </h2>
          <p className="section-subtitle">{t("description")}</p>
        </motion.div>

        <div className={styles.timelineWrapper}>
          <div className={styles.ribbonContainer} aria-hidden>
            <svg width="100%" height="100%" viewBox="0 0 100 800" preserveAspectRatio="none">
              <defs>
                <linearGradient id={`hiw-stroke-${filterUid}`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.65" />
                  <stop offset="45%" stopColor="var(--gold)" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.55" />
                </linearGradient>
                <filter id={glowFilterId} x="-80%" y="-20%" width="260%" height="140%">
                  <feGaussianBlur stdDeviation="1.8" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Wide soft bed */}
              <motion.path
                d={PATH_D}
                fill="none"
                stroke="var(--primary)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
                opacity={0.08}
                style={{
                  pathLength: reducedMotion ? 1 : trailDraw,
                }}
              />
              {/* Ghost trail (lags primary slightly) */}
              <motion.path
                d={PATH_D}
                fill="none"
                stroke={`url(#hiw-stroke-${filterUid})`}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
                strokeDasharray="0 1"
                style={{
                  pathLength: reducedMotion ? 1 : trailDraw,
                  opacity: reducedMotion ? 0.28 : 0.42,
                }}
              />
              {/* Accent highlight */}
              <motion.path
                d={PATH_D}
                fill="none"
                stroke="var(--gold)"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
                opacity={0.55}
                style={{
                  pathLength: reducedMotion ? 1 : accentDraw,
                }}
              />
              {/* Main ribbon */}
              <motion.path
                d={PATH_D}
                fill="none"
                stroke="var(--primary)"
                strokeWidth="2.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
                filter={`url(#${glowFilterId})`}
                style={{
                  pathLength: reducedMotion ? 1 : primaryDraw,
                }}
              />
            </svg>
          </div>

          <div className={styles.steps}>
            {JOURNEY_STEPS.map((step, index) => (
              <motion.div
                key={step.id}
                className={`${styles.stepCard} ${index % 2 === 0 ? styles.even : styles.odd}`}
                initial={
                  reducedMotion
                    ? { opacity: 1, x: 0 }
                    : { opacity: 0, x: index % 2 === 0 ? -44 : 44 }
                }
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-90px" }}
                transition={{ duration: 0.75, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className={styles.cardGlow} style={{ backgroundColor: `${step.color}10` }} />
                <div className={styles.iconBox} style={{ color: step.color }}>
                  <step.icon size={32} />
                </div>
                <div className={styles.content}>
                  <span className={styles.stepNum}>
                    {t("day")} 0{index + 1}
                  </span>
                  <h3 className={styles.stepTitle}>{t(`${step.id}.title`)}</h3>
                  <p className={styles.stepDesc}>{t(`${step.id}.desc`)}</p>
                </div>

                <motion.div
                  className={styles.connectorDot}
                  animate={
                    reducedMotion ? undefined : { scale: [1, 1.2, 1] }
                  }
                  transition={{
                    duration: 2.6 + index * 0.28,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
