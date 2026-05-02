"use client";

import React, { useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { 
  TbPlaneArrival, 
  TbStethoscope, 
  TbHotelService, 
  TbConfetti,
} from "react-icons/tb";
import styles from "./HowItWorks.module.css";

const JOURNEY_STEPS = [
  {
    id: "step1",
    icon: TbPlaneArrival,
    color: "#BC0A18"
  },
  {
    id: "step2",
    icon: TbStethoscope,
    color: "#E8333F"
  },
  {
    id: "step3",
    icon: TbHotelService,
    color: "#D4AF37"
  },
  {
    id: "step4",
    icon: TbConfetti,
    color: "#FDFDFF"
  }
];

export default function HowItWorks() {
  const t = useTranslations("howItWorks");
  const prefersReducedMotion = useReducedMotion();
  const reducedMotion = prefersReducedMotion === true;
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Scroll-draw ribbon (wider input range so the path fills while section is on screen)
  const scrollPathLength = useTransform(scrollYProgress, [0.05, 0.92], [0, 1]);

  return (
    <section className={`section ${styles.journey}`} ref={containerRef}>
      <div className="container">
        <div className="section-header">
          <div className="section-badge">{t("badge")}</div>
          <h2 className="section-title">{t("titleMain")} <span>{t("titleSpan")}</span> {t("titleEnd")}</h2>
          <p className="section-subtitle">
            {t("description")}
          </p>
        </div>

        <div className={styles.timelineWrapper}>
          {/* The Fluid Ribbon (SVG) */}
          <div className={styles.ribbonContainer} aria-hidden>
            <svg width="100%" height="100%" viewBox="0 0 100 800" preserveAspectRatio="none">
              <defs>
                <filter id="howItWorksRibbonGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="1.2" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <motion.path
                d="M 50 0 Q 80 200 50 400 Q 20 600 50 800"
                fill="none"
                stroke="var(--primary)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
                strokeDasharray="0 1"
                style={
                  reducedMotion
                    ? { pathLength: 1, opacity: 0.22 }
                    : { pathLength: scrollPathLength, opacity: 0.22 }
                }
              />
              <motion.path
                d="M 50 0 Q 80 200 50 400 Q 20 600 50 800"
                fill="none"
                stroke="var(--primary)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
                filter="url(#howItWorksRibbonGlow)"
                style={
                  reducedMotion ? { pathLength: 1 } : { pathLength: scrollPathLength }
                }
              />
            </svg>
          </div>

          <div className={styles.steps}>
            {JOURNEY_STEPS.map((step, index) => (
              <motion.div 
                key={step.id} 
                className={`${styles.stepCard} ${index % 2 === 0 ? styles.even : styles.odd}`}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                <div className={styles.cardGlow} style={{ backgroundColor: `${step.color}10` }} />
                <div className={styles.iconBox} style={{ color: step.color }}>
                  <step.icon size={32} />
                </div>
                <div className={styles.content}>
                  <span className={styles.stepNum}>{t("day")} 0{index + 1}</span>
                  <h3 className={styles.stepTitle}>{t(`${step.id}.title`)}</h3>
                  <p className={styles.stepDesc}>{t(`${step.id}.desc`)}</p>
                </div>
                
                {/* Connector Dot */}
                <div className={styles.connectorDot} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
