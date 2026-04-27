"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { CheckCircle2, Globe, MessageCircle, ShieldCheck, Star } from "lucide-react";
import styles from "./Testimonials.module.css";

const REVIEWS = [
  { id: 1, name: "James Mitchell", country: "🇬🇧 United Kingdom", avatar: "JM", rating: 5, key: "review1" },
  { id: 2, name: "Hans Weber", country: "🇩🇪 Deutschland", avatar: "HW", rating: 5, key: "review2" },
  { id: 3, name: "Fatima Al-Rashid", country: "🇸🇦 Saudi Arabia", avatar: "FA", rating: 5, key: "review3" },
  { id: 4, name: "Mehmet Yılmaz", country: "🇹🇷 Türkiye", avatar: "MY", rating: 5, key: "review4" },
  { id: 5, name: "Sofia Rossi", country: "🇮🇹 Italia", avatar: "SR", rating: 5, key: "review5" },
  { id: 6, name: "Noah Williams", country: "🇺🇸 United States", avatar: "NW", rating: 5, key: "review6" },
];

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
  review: (typeof REVIEWS)[number];
  t: ReturnType<typeof useTranslations>;
  tTreatments: ReturnType<typeof useTranslations>;
}) {
  const treatmentId = t(`${review.key}.treatment`);
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
          <p className="section-subtitle">{t("subtitle")}</p>
        </header>

        <div className={styles.grid}>
          {REVIEWS.map((review) => (
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
