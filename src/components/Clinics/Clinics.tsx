"use client";

import React, { useMemo, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { ArrowRight, Building2, CheckCircle2, MapPin, Search, Sparkles, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import BookingModal from "../Booking/BookingModal";
import { CLINICS } from "@/data";
import type { Clinic } from "@/data";
import { motion } from "framer-motion";
import styles from "./Clinics.module.css";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className={styles.stars} aria-label={`${rating} / 5`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill={s <= Math.round(rating) ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

function ClinicCard({
  clinic,
  t,
  tTreatments,
  onBook,
}: {
  clinic: Clinic;
  t: ReturnType<typeof useTranslations>;
  tTreatments: ReturnType<typeof useTranslations>;
  onBook: () => void;
}) {
  return (
    <article className={styles.card}>
      <header className={styles.cardHd}>
        <div className={styles.hdTop}>
          <div className={styles.hdLeft}>
            <h3 className={styles.title} title={clinic.name}>
              {clinic.name}
            </h3>
            <p className={styles.meta} title={clinic.location}>
              <MapPin size={14} aria-hidden="true" />
              <span className={styles.metaText}>{clinic.location}</span>
            </p>
          </div>

          <div className={styles.badges} aria-label={t("verified")}>
            {clinic.verified ? (
              <span className={styles.badgeSuccess}>
                <CheckCircle2 size={12} aria-hidden="true" />
                <span className={styles.badgeText}>{t("verified")}</span>
              </span>
            ) : null}
            {clinic.badgeKey ? (
              <span
                className={styles.badgeCustom}
                style={{
                  background: `${clinic.badgeColor}1a`,
                  borderColor: `${clinic.badgeColor}40`,
                  color: clinic.badgeColor ?? "var(--text-secondary)",
                }}
              >
                {t(clinic.badgeKey)}
              </span>
            ) : null}
          </div>
        </div>
      </header>

      <div className={styles.cardBd}>
        <div className={styles.ratingRow}>
          <StarRating rating={clinic.rating} />
          <span className={styles.ratingValue}>{clinic.rating.toFixed(1)}</span>
          <span className={styles.ratingCount}>
            ({clinic.reviews} {t("reviews")})
          </span>
        </div>

        <ul className={styles.pills} aria-label={t("specialties")}>
          {clinic.specialties.map((s) => (
            <li key={s} className={styles.pill} title={tTreatments(`${s}.title`) || s}>
              {tTreatments(`${s}.title`) || s}
            </li>
          ))}
        </ul>

        <p className={`${styles.desc} ${styles.clamp3}`}>{clinic.blurb}</p>
      </div>

      <footer className={styles.cardFt}>
        <button className="btn btn-primary btn-sm" onClick={onBook}>
          {t("bookNow")}
          <ArrowRight size={16} aria-hidden="true" />
        </button>
      </footer>
    </article>
  );
}

export default function Clinics() {
  const t = useTranslations("clinics");
  const tNav = useTranslations("nav");
  const tTreatments = useTranslations("treatments");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const [bookingOpen, setBookingOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"rating" | "reviews">("rating");

  const locationOptions = useMemo(
    () => Array.from(new Set(CLINICS.map((clinic) => clinic.location))),
    []
  );

  const visibleClinics = useMemo(() => {
    const filtered = CLINICS.filter((clinic) => {
      if (locationFilter !== "all" && clinic.location !== locationFilter) {
        return false;
      }
      const normalizedSearch = searchQuery.trim().toLowerCase();
      if (!normalizedSearch) {
        return true;
      }
      return `${clinic.name} ${clinic.location} ${clinic.blurb}`.toLowerCase().includes(normalizedSearch);
    });
    return filtered.sort((a, b) => (sortBy === "reviews" ? b.reviews - a.reviews : b.rating - a.rating));
  }, [locationFilter, searchQuery, sortBy]);

  return (
    <section id="clinics" className={`section ${styles.clinics}`}>
      <div className="container">
        {/* Header */}
        <header className="section-header" style={{ marginBottom: "1.5rem" }}>
          <div className="section-badge">
            <Building2 size={16} aria-hidden="true" style={{ display: "inline", marginRight: 6 }} />
            {tNav("clinics")}
          </div>
          <h2 className="section-title">
            {t("title").split(" ").slice(0, -1).join(" ")} <span>{t("title").split(" ").slice(-1)}</span>
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

        <div className={styles.controlsWrapper}>
          {/* Search chip */}
          <div className={styles.searchChip}>
            <Search size={18} className={styles.chipIcon} aria-hidden="true" />
            <div className={styles.chipInner}>
              <span className={styles.chipLabel}>{tCommon("search")}</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={tCommon("searchPlaceholderList")}
                className={styles.searchInput}
              />
            </div>
          </div>

          {/* Location filter chip */}
          <div className={styles.filterChip}>
            <MapPin size={16} className={styles.chipIcon} aria-hidden="true" />
            <div className={styles.chipInner}>
              <span className={styles.chipLabel}>{tCommon("filter")}</span>
              <select
                className={styles.selectInput}
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                aria-label={tCommon("filter")}
              >
                <option value="all">{tCommon("all")}</option>
                {locationOptions.map((location) => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Sort filter chip */}
          <div className={styles.filterChip}>
            <SlidersHorizontal size={16} className={styles.chipIcon} aria-hidden="true" />
            <div className={styles.chipInner}>
              <span className={styles.chipLabel}>{tCommon("sortBy")}</span>
              <select
                className={styles.selectInput}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "rating" | "reviews")}
                aria-label={tCommon("sortBy")}
              >
                <option value="rating">{tCommon("sortRating")}</option>
                <option value="reviews">{tCommon("sortReviews")}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className={styles.grid} aria-label={tNav("clinics")}>
          {visibleClinics.map((clinic) => (
            <ClinicCard
              key={clinic.id}
              clinic={clinic}
              t={t}
              tTreatments={tTreatments}
              onBook={() => setBookingOpen(true)}
            />
          ))}
          {visibleClinics.length === 0 ? <div className={styles.emptyState}>{t("subtitle")}</div> : null}
        </div>

        {/* View All */}
        <div className={styles.viewAllWrap}>
          <Link className="btn btn-ghost" href={`/${locale}/clinics`}>
            {t("viewAll")}
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
      
      <BookingModal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} locale={locale} />
    </section>
  );
}
