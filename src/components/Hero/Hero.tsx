"use client";

import { useTranslations, useLocale } from "next-intl";
import { useState, useRef } from "react";
import { Users, Globe2, ArrowRight, Play, Zap } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import BookingModal from "../Booking/BookingModal";
import HowItWorksModal from "../HowItWorksModal/HowItWorksModal";
import styles from "./Hero.module.css";
import Image from "next/image";

export default function Hero() {
  const t = useTranslations("hero");
  const locale = useLocale();
  const [bookingOpen, setBookingOpen] = useState(false);
  const [howItWorksOpen, setHowItWorksOpen] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const imageScale = useTransform(scrollYProgress, [0, 0.6], [1, 1.1]);
  const imageY = useTransform(scrollYProgress, [0, 0.6], [0, 40]);

  return (
    <section className={styles.hero} ref={containerRef}>
      
      <div className={styles.stickyContainer}>
        <div className="container">
          <div className={styles.layout}>
            {/* Left: Content */}
            <div className={styles.content}>
              <div className="section-badge">
                <Zap size={14} /> {t("badge")}
              </div>
              <h1 className={styles.title}>
                {t("titleMain")} <br />
                <span>{t("titleSpan")}</span>
              </h1>
              <p className={styles.subtitle}>
                {t("subtitle")}
              </p>
              
              <div className={styles.ctas}>
                <button className="btn btn-primary btn-lg" onClick={() => setBookingOpen(true)}>
                  {t("btnVoyage")}
                  <ArrowRight size={18} />
                </button>
                <button className="btn btn-ghost btn-lg" onClick={() => setHowItWorksOpen(true)}>
                  <Play size={14} fill="currentColor" />
                  {t("btnHowItWorks")}
                </button>
              </div>

              {/* Static Stats Area */}
              <div className={styles.staticStats}>
                <div className={styles.statItem}>
                  <Users size={18} />
                  <span>{t("islandSupport")}</span>
                </div>
                <div className={styles.statDivider} />
                <div className={styles.statItem}>
                  <Globe2 size={18} />
                  <span>{t("islandCountries")}</span>
                </div>
              </div>

            </div>

            {/* Right: Image */}
            <div className={styles.visualizer}>
              <motion.div 
                className={styles.heroImageWrapper}
                style={{ 
                  scale: imageScale,
                  y: imageY,
                }}
              >
                <Image 
                  src="/images/tooth_hero_real_transparent.png" 
                  alt="Tooth Jewel" 
                  fill 
                  sizes="(max-width: 768px) 90vw, (max-width: 1200px) 50vw, 40vw"
                  priority
                  className={styles.heroImg}
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      
      <BookingModal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} locale={locale} />
      <HowItWorksModal
        isOpen={howItWorksOpen}
        onClose={() => setHowItWorksOpen(false)}
        onBooking={() => setBookingOpen(true)}
      />
    </section>
  );
}
