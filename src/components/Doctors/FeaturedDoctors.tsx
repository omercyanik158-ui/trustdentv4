"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, Stethoscope, Star, Building2, Search, SlidersHorizontal, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { DOCTORS } from "@/data";
import styles from "./FeaturedDoctors.module.css";

export default function FeaturedDoctors() {
  const t = useTranslations("doctors");
  const tClinics = useTranslations("clinics");
  const tNav = useTranslations("nav");
  const tCommon = useTranslations("common");
  const locale = useLocale();

  const [searchQuery, setSearchQuery] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"rating" | "reviews">("rating");

  const specialtyOptions = useMemo(
    () => Array.from(new Set(DOCTORS.map((d) => d.title))),
    []
  );

  const visibleDoctors = useMemo(() => {
    const filtered = DOCTORS.filter((d) => {
      if (specialtyFilter !== "all" && d.title !== specialtyFilter) {
        return false;
      }
      const normalizedSearch = searchQuery.trim().toLowerCase();
      if (!normalizedSearch) {
        return true;
      }
      return `${d.name} ${d.title} ${d.clinicName} ${d.review}`.toLowerCase().includes(normalizedSearch);
    });
    return filtered.sort((a, b) => (sortBy === "reviews" ? b.reviews - a.reviews : b.rating - a.rating));
  }, [specialtyFilter, searchQuery, sortBy]);

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
        </header>

        <motion.div
          className={styles.subtitleBox}
          initial={{ opacity: 0, clipPath: "inset(0 40% 0 40% round 24px)", y: 20 }}
          whileInView={{ opacity: 1, clipPath: "inset(0 0% 0 0% round 24px)", y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className={styles.subtitleIcon}>
            <Sparkles size={22} aria-hidden="true" />
          </div>
          <p className={styles.subtitleText}>{t("featuredSubtitle")}</p>
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

          {/* Specialty filter chip */}
          <div className={styles.filterChip}>
            <Stethoscope size={16} className={styles.chipIcon} aria-hidden="true" />
            <div className={styles.chipInner}>
              <span className={styles.chipLabel}>{tCommon("filter")}</span>
              <select
                className={styles.selectInput}
                value={specialtyFilter}
                onChange={(e) => setSpecialtyFilter(e.target.value)}
                aria-label={tCommon("filter")}
              >
                <option value="all">{tCommon("all")}</option>
                {specialtyOptions.map((specialty) => (
                  <option key={specialty} value={specialty}>{specialty}</option>
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

        <div className={styles.grid} aria-label={tNav("doctors")}>
          {visibleDoctors.map((d) => (
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
          {visibleDoctors.length === 0 ? <div style={{ color: "var(--text-muted)", padding: "2rem", gridColumn: "1 / -1", textAlign: "center" }}>{tCommon("noResults", { fallback: "No results found" })}</div> : null}
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

