"use client";

import { useTranslations } from "next-intl";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { Star, Stethoscope, Building2 } from "lucide-react";
import { DOCTORS } from "@/data";
import styles from "./DoctorsPage.module.css";

export default function DoctorsPage() {
  const tNav = useTranslations("nav");
  const t = useTranslations("doctors");
  return (
    <>
      <Navbar />
      <main className={styles.page}>
        <div className="container">
          <header className="section-header">
            <div className="section-badge">
              <Stethoscope size={16} aria-hidden="true" style={{ display: "inline", marginRight: 6 }} />
              {tNav("doctors")}
            </div>
            <h1 className="section-title">
              {t("featuredTitle").split(" ").slice(0, -1).join(" ")} <span>{t("featuredTitle").split(" ").slice(-1)}</span>
            </h1>
            <p className="section-subtitle">{t("featuredSubtitle")}</p>
          </header>

          <section className={styles.grid} aria-label={tNav("doctors")}>
            {DOCTORS.map((d) => (
              <article key={d.id} className={styles.card}>
                <header className={styles.cardHd}>
                  <div className={styles.hdTop}>
                    <div className={styles.hdLeft}>
                      <div className={styles.avatar} aria-hidden="true">
                        {d.initials}
                      </div>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <h2 className={styles.title} title={d.name}>
                          {d.name}
                        </h2>
                        <div className={styles.meta}>
                          <span className={styles.pill} title={d.title}>
                            <Stethoscope size={12} strokeWidth={2.5} />
                            <span>{d.title}</span>
                          </span>
                          <span className={`${styles.pill} ${styles.pillClinic}`} title={d.clinicName}>
                            <Building2 size={12} strokeWidth={2.5} />
                            <span>{d.clinicName}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </header>

                <div className={styles.cardBd}>
                  <div className={styles.ratingRow} aria-label="Rating">
                    <span className={styles.stars} aria-hidden="true">
                      <Star size={14} />
                    </span>
                    <span className={styles.rating}>{d.rating.toFixed(1)}</span>
                    <span className={styles.ratingCount}>({d.reviews} {t("reviews")})</span>
                  </div>
                  <div className={styles.review}>
                    <span className={styles.reviewText}>{d.review}</span>
                  </div>
                </div>

                <footer className={styles.cardFt}>
                  <button className="btn btn-primary btn-sm">{t("bookAppointment")}</button>
                </footer>
              </article>
            ))}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
