"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { X, ArrowRight, ArrowLeft, Calendar, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TbPlaneArrival,
  TbStethoscope,
  TbHotelService,
  TbConfetti,
} from "react-icons/tb";
import styles from "./HowItWorksModal.module.css";

const STEPS = [
  { id: "step1", icon: TbPlaneArrival, color: "#BC0A18", bg: "rgba(188,10,24,0.15)", videoSrc: null },
  { id: "step2", icon: TbStethoscope, color: "#E8333F", bg: "rgba(232,51,63,0.15)", videoSrc: null },
  { id: "step3", icon: TbHotelService, color: "#D4AF37", bg: "rgba(212,175,55,0.15)", videoSrc: null },
  { id: "step4", icon: TbConfetti, color: "#a0c4ff", bg: "rgba(160,196,255,0.15)", videoSrc: null },
];

// Her adım için video eklemek istediğinde videoSrc alanını doldur:
// videoSrc: "https://www.youtube.com/embed/VIDEO_ID"
// ya da yerel dosya: videoSrc: "/videos/step1.mp4"

const STEP_DURATION = 2500;

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onBooking: () => void;
};

export default function HowItWorksModal({ isOpen, onClose, onBooking }: Props) {
  const t = useTranslations("howItWorks");
  const th = useTranslations("hero");

  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback((index: number) => {
    setCurrent(index);
    setProgress(0);
  }, []);

  const next = useCallback(() => {
    setCurrent((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    setProgress(0);
  }, []);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev > 0 ? prev - 1 : prev));
    setProgress(0);
  }, []);

  // Auto-advance timer
  useEffect(() => {
    if (!isOpen || paused) return;

    const TICK = 30;
    const increment = (TICK / STEP_DURATION) * 100;

    progressRef.current = setInterval(() => {
      setProgress((p) => {
        if (p + increment >= 100) {
          setCurrent((c) => {
            if (c < STEPS.length - 1) return c + 1;
            return c;
          });
          return 0;
        }
        return p + increment;
      });
    }, TICK);

    return () => {
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [isOpen, paused, current]);

  // Reset on open/close
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, []);

  if (!isOpen) return null;

  const step = STEPS[current];
  const Icon = step.icon;

  const handleBooking = () => {
    onClose();
    setTimeout(() => onBooking(), 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
        >
          <motion.div
            className={styles.modal}
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 24 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {/* Close */}
            <button className={styles.closeBtn} onClick={onClose} aria-label="Kapat">
              <X size={20} />
            </button>

            {/* Progress bars */}
            <div className={styles.progressBars}>
              {STEPS.map((s, i) => (
                <button
                  key={s.id}
                  className={`${styles.progressTrack} ${i === current ? styles.progressTrackActive : ""}`}
                  onClick={() => goTo(i)}
                  aria-label={`Adım ${i + 1}`}
                  style={
                    i === current
                      ? {
                          borderColor: `${s.color}66`,
                          boxShadow: `0 0 0 1px ${s.color}33 inset, 0 0 10px ${s.color}33`,
                        }
                      : undefined
                  }
                >
                  <div
                    className={styles.progressFill}
                    style={{
                      width: i < current ? "100%" : i === current ? `${progress}%` : "0%",
                      background: s.color,
                    }}
                  />
                </button>
              ))}
            </div>

            {/* Step counter */}
            <div className={styles.counter}>
              <span style={{ color: step.color }}>{current + 1}</span>
              <span className={styles.counterSep}>/</span>
              <span>{STEPS.length}</span>
            </div>

            {/* Animated content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                className={styles.content}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Video area */}
                <div className={styles.videoWrap} style={{ borderColor: `${step.color}30` }}>
                  {step.videoSrc ? (
                    <iframe
                      src={step.videoSrc}
                      className={styles.videoFrame}
                      allow="autoplay; fullscreen"
                      allowFullScreen
                      title={t(`${step.id}.title`)}
                    />
                  ) : (
                    <div className={styles.videoPlaceholder} style={{ background: step.bg }}>
                      <motion.div
                        className={styles.placeholderIcon}
                        style={{ background: step.bg, borderColor: `${step.color}40` }}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                      >
                        <Icon size={36} color={step.color} />
                      </motion.div>
                      <motion.div
                        className={styles.playBadge}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <Play size={11} fill="currentColor" />
                        {t("videoSoon")}
                      </motion.div>
                    </div>
                  )}
                </div>

                {/* Day label */}
                <motion.span
                  className={styles.dayLabel}
                  style={{ color: step.color }}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  {t("day")} 0{current + 1}
                </motion.span>

                {/* Title */}
                <motion.h2
                  className={styles.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18 }}
                >
                  {t(`${step.id}.title`)}
                </motion.h2>

                {/* Description */}
                <motion.p
                  className={styles.desc}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.22 }}
                >
                  {t(`${step.id}.desc`)}
                </motion.p>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className={styles.nav}>
              <button
                className={styles.navBtn}
                onClick={prev}
                disabled={current === 0}
                aria-label="Önceki"
              >
                <ArrowLeft size={18} />
              </button>

              <div className={styles.dots}>
                {STEPS.map((s, i) => (
                  <button
                    key={s.id}
                    className={`${styles.dot} ${i === current ? styles.dotActive : ""}`}
                    style={i === current ? { background: step.color } : {}}
                    onClick={() => goTo(i)}
                    aria-label={`Adım ${i + 1}`}
                  />
                ))}
              </div>

              <button
                className={styles.navBtn}
                onClick={next}
                disabled={current === STEPS.length - 1}
                aria-label="Sonraki"
              >
                <ArrowRight size={18} />
              </button>
            </div>

            {/* CTA */}
            <motion.button
              className={styles.ctaBtn}
              onClick={handleBooking}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Calendar size={18} />
              {th("bookNow")}
              <ArrowRight size={16} />
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
