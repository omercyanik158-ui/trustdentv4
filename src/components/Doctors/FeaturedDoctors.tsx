"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, Stethoscope, Star, Building2 } from "lucide-react";
import { DOCTORS } from "@/data";
import styles from "./FeaturedDoctors.module.css";

export default function FeaturedDoctors() {
  const t = useTranslations("doctors");
  const tClinics = useTranslations("clinics");
  const tNav = useTranslations("nav");
  const locale = useLocale();

  return (
    <section id="featured-doctors" className={`section ${styles.section}`}>
      <div className="container">
        <header className="section-header">
          <div className="section-badge">
            <Stethoscope size={16} aria-hidden="true" style={{ display: "inline", marginRight: 6 }} />
            {tNav("doctors")}
          </div>
          <h2 className="section-title">
            {t("featuredTitle").split(" ").slice(0, -1).join(" ")} <span>{t("featuredTitle").split(" ").slice(-1)}</span>
          </h2>
          <p className="section-subtitle">{t("featuredSubtitle")}</p>
        </header>

        <div className={styles.grid} aria-label={tNav("doctors")}>
          {DOCTORS.map((d) => (
            <article key={d.id} className={styles.card}>
              <header className={styles.cardHd}>
                <div className={styles.hdTop}>
                  <div className={styles.hdLeft}>
                    <div className={styles.avatar} aria-hidden="true">
                      <span className={styles.avatarText}>{d.initials}</span>
                    </div>
                    <div className={styles.hdMain}>
                      <h3 className={styles.name} title={d.name}>
                        {d.name}
                      </h3>
                      <p className={styles.meta} title={`${d.title} · ${d.clinicName}`}>
                        <span className={`${styles.metaText} ${styles.metaSpecialty}`}>
                          <Stethoscope size={11} strokeWidth={2.5} />
                          {d.title}
                        </span>
                        <span className={styles.dot} aria-hidden="true">
                          ·
                        </span>
                        <span className={`${styles.metaText} ${styles.metaClinic}`}>
                          <Building2 size={11} strokeWidth={2.5} />
                          {d.clinicName}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </header>

              <div className={styles.cardBd}>
                <div className={styles.ratingRow} aria-label={tClinics("rating")}>
                  <span className={styles.stars} aria-hidden="true">
                    <Star size={14} />
                  </span>
                  <span className={styles.ratingValue}>{d.rating.toFixed(1)}</span>
                  <span className={styles.ratingCount}>({d.reviews} {t("reviews")})</span>
                </div>
                <div className={styles.review}>
                  <span className={styles.reviewText}>{d.review}</span>
                </div>
              </div>

              <footer className={styles.cardFt}>
                <Link className="btn btn-primary btn-sm" href={`/${locale}/doctors`}>
                  {t("viewProfile")}
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </footer>
            </article>
          ))}
        </div>

        <div className={styles.viewAll}>
          <Link className="btn btn-ghost" href={`/${locale}/doctors`}>
            {t("viewAll")}
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

