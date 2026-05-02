"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { Star, Stethoscope, Building2, Search } from "lucide-react";
import { DOCTORS } from "@/data";
import BookingModal from "@/components/Booking/BookingModal";
import styles from "./DoctorsPage.module.css";

export default function DoctorsPage() {
  const tNav = useTranslations("nav");
  const t = useTranslations("doctors");
  const tClinics = useTranslations("clinics");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const [searchQuery, setSearchQuery] = useState("");
  const [clinicFilter, setClinicFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"rating" | "reviews" | "name">("rating");
  const [bookingOpen, setBookingOpen] = useState(false);

  const clinicOptions = useMemo(
    () => Array.from(new Set(DOCTORS.map((doctor) => doctor.clinicName))),
    []
  );
  const visibleDoctors = useMemo(() => {
    const filtered = DOCTORS.filter((doctor) => {
      if (clinicFilter !== "all" && doctor.clinicName !== clinicFilter) {
        return false;
      }
      const normalizedSearch = searchQuery.trim().toLowerCase();
      if (!normalizedSearch) {
        return true;
      }
      return `${doctor.name} ${doctor.title} ${doctor.clinicName} ${doctor.review}`
        .toLowerCase()
        .includes(normalizedSearch);
    });

    return filtered.sort((a, b) => {
      if (sortBy === "reviews") {
        return b.reviews - a.reviews;
      }
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }
      return b.rating - a.rating;
    });
  }, [clinicFilter, searchQuery, sortBy]);

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

          <div className={styles.controls}>
            <label className={styles.control}>
              <span>{tCommon("search")}</span>
              <div className="input" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Search size={14} aria-hidden="true" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={tCommon("searchPlaceholderList")}
                  style={{ border: 0, outline: "none", background: "transparent", width: "100%" }}
                />
              </div>
            </label>
            <label className={styles.control}>
              <span>{tCommon("filter")} ({tNav("clinics")})</span>
              <select className="input" value={clinicFilter} onChange={(e) => setClinicFilter(e.target.value)}>
                <option value="all">{tCommon("all")}</option>
                {clinicOptions.map((clinic) => (
                  <option key={clinic} value={clinic}>
                    {clinic}
                  </option>
                ))}
              </select>
            </label>
            <label className={styles.control}>
              <span>{tCommon("sortBy")}</span>
              <select
                className="input"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "rating" | "reviews" | "name")}
              >
                <option value="rating">{tCommon("sortRating")}</option>
                <option value="reviews">{tCommon("sortReviews")}</option>
                <option value="name">{tCommon("sortAZ")}</option>
              </select>
            </label>
          </div>

          <section className={styles.grid} aria-label={tNav("doctors")}>
            {visibleDoctors.map((d) => (
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
                  <div className={styles.ratingRow} aria-label={tClinics("rating")}>
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
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => setBookingOpen(true)}
                  >
                    {t("bookAppointment")}
                  </button>
                </footer>
              </article>
            ))}
            {visibleDoctors.length === 0 ? (
              <div className={styles.emptyState}>{t("featuredSubtitle")}</div>
            ) : null}
          </section>
        </div>
      </main>
      <Footer />
      <BookingModal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} locale={locale} />
    </>
  );
}
