"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { CheckCircle2, Globe, MessageCircle, ShieldCheck, Star, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { TESTIMONIALS } from "@/data";
import type { Testimonial } from "@/data";
import styles from "./Testimonials.module.css";

const TREATMENT_ID_ALIASES: Record<string, string> = {
  implantes: "implants",
  zirconio: "zirconia",
  carillas: "veneers",
  ortodoncia: "orthodontics",
  blanqueamiento: "whitening",
};

function normalizeTreatmentId(id: string) {
  return TREATMENT_ID_ALIASES[id] ?? id;
}

function Stars({ count }: { count: number }) {
  return (
    <div className={styles.stars} aria-label={`${count} / 5`}>
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

function ReviewCard({
  review,
  t,
  tTreatments,
}: {
  review: Testimonial;
  t: ReturnType<typeof useTranslations>;
  tTreatments: ReturnType<typeof useTranslations>;
}) {
  const treatmentId = normalizeTreatmentId(t(`${review.key}.treatment`));
  return (
    <article className={styles.card}>
      <header className={styles.cardHd}>
        <div className={styles.hdRow}>
          <div className={styles.avatar} aria-hidden="true">
            {review.avatar}
          </div>
          <div className={styles.hdMain}>
            <h3 className={styles.name} title={review.name}>
              {review.name}
            </h3>
            <p className={styles.meta} title={`${review.country} · ${t(`${review.key}.date`)}`}>
              <span className={styles.metaText}>{review.country}</span>
              <span className={styles.dot} aria-hidden="true">
                ·
              </span>
              <span className={styles.metaText}>{t(`${review.key}.date`)}</span>
            </p>
          </div>
        </div>
      </header>

      <div className={styles.cardBd}>
        <div className={styles.ratingRow}>
          <Stars count={review.rating} />
          <span className={styles.treatment} title={tTreatments(`${treatmentId}.title`) || treatmentId}>
            {tTreatments(`${treatmentId}.title`) || treatmentId}
          </span>
        </div>

        <p className={`${styles.reviewText} ${styles.clamp3}`}>{t(`${review.key}.text`)}</p>
      </div>

      <footer className={styles.cardFt}>
        <span className={styles.verified}>
          <CheckCircle2 size={14} aria-hidden="true" />
          {t("verified", { defaultValue: "Doğrulandı" })}
        </span>
      </footer>
    </article>
  );
}

export default function Testimonials() {
  const t = useTranslations("testimonials");
  const tTreatments = useTranslations("treatments");

  return (
    <section className={`section ${styles.testimonials}`}>
      <div className="container">
        <header className="section-header">
          <div className="section-badge">
            <MessageCircle size={16} aria-hidden="true" style={{ display: "inline", marginRight: 6 }} />
            {t("badge")}
          </div>
          <h2 className="section-title">
            {t("title").split(" ").slice(0, 3).join(" ")} <span>{t("title").split(" ").slice(3).join(" ")}</span>
          </h2>
        </header>

        <motion.div
          className={styles.subtitleBox}
          initial={{ opacity: 0, clipPath: "inset(0 40% 0 40% round 24px)", y: 20 }}
          whileInView={{ opacity: 1, clipPath: "inset(0 0% 0 0% round 24px)", y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className={styles.subtitleIcon}>
            <Sparkles size={24} aria-hidden="true" />
          </div>
          <p className={styles.subtitleText}>{t("subtitle")}</p>
        </motion.div>

        <div className={styles.grid}>
          {TESTIMONIALS.map((review) => (
            <ReviewCard key={review.id} review={review} t={t} tTreatments={tTreatments} />
          ))}
        </div>

        {/* Trust Indicators */}
        <div className={styles.trustRow}>
          <div className={styles.trustItem}>
            <span className={styles.trustIcon}><ShieldCheck size={20} color="var(--gold)"/></span>
            <span>{t("trust.secure")}</span>
          </div>
          <div className={styles.trustDivider} />
          <div className={styles.trustItem}>
            <span className={styles.trustIcon}><CheckCircle2 size={20} color="var(--primary)"/></span>
            <span>{t("trust.verified")}</span>
          </div>
          <div className={styles.trustDivider} />
          <div className={styles.trustItem}>
            <span className={styles.trustIcon}><Globe size={20} color="var(--text-secondary)"/></span>
            <span>{t("trust.countries")}</span>
          </div>
          <div className={styles.trustDivider} />
          <div className={styles.trustItem}>
            <span className={styles.trustIcon}><Star size={20} fill="var(--gold)" color="var(--gold)"/></span>
            <span>{t("trust.rating")}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
