"use client";

import React, { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { ArrowRight, Building2, CheckCircle2, MapPin } from "lucide-react";
import BookingModal from "../Booking/BookingModal";
import styles from "./Clinics.module.css";

const CLINICS = [
  {
    id: 1,
    name: "DentaLux İstanbul",
    location: "Şişli, İstanbul",
    rating: 4.9,
    reviews: 847,
    specialties: ["implants", "zirconia", "veneers"],
    blurb:
      "İmplant ve zirkonya alanında uzman ekip, şeffaf planlama ve hızlı randevu. Süreç boyunca birebir takip ve yüksek hasta memnuniyeti.",
    verified: true,
    badgeKey: "badgeMostPreferred",
    badgeColor: "#BC0A18", /* Primary Red */
  },
  {
    id: 2,
    name: "Smile Clinic Antalya",
    location: "Lara, Antalya",
    rating: 4.8,
    reviews: 562,
    specialties: ["whitening", "orthodontics", "implants"],
    blurb:
      "Tatil planına uyumlu randevu saatleri, dijital ölçüm ve konfor odaklı uygulamalar. Beyazlatma ve ortodontide güçlü sonuçlar.",
    verified: true,
    badgeKey: "badgeJci",
    badgeColor: "#D4AF37", /* Gold */
  },
  {
    id: 3,
    name: "PearlDent Ankara",
    location: "Çankaya, Ankara",
    rating: 4.7,
    reviews: 389,
    specialties: ["root-canal", "veneers", "implants"],
    blurb:
      "Kanal tedavisi ve estetik gülüş tasarımında detaycı yaklaşım. Tedavi planı net, iletişim hızlı ve sonrası destek güçlü.",
    verified: true,
    badgeKey: "badgeNewlyOpened",
    badgeColor: "#BC0A18", /* Primary Red */
  },
  {
    id: 4,
    name: "Istanbul Dental Center",
    location: "Beşiktaş, İstanbul",
    rating: 4.8,
    reviews: 1204,
    specialties: ["full-mouth", "zirconia", "whitening"],
    blurb:
      "Tam ağız rehabilitasyon süreçlerinde deneyimli ekip. Gülüş estetiği odaklı planlama, premium malzeme seçenekleri ve düzenli kontrol.",
    verified: true,
    badgeKey: "badgePremium",
    badgeColor: "#D4AF37", /* Gold */
  },
  {
    id: 5,
    name: "MedDent İzmir",
    location: "Alsancak, İzmir",
    rating: 4.6,
    reviews: 298,
    specialties: ["orthodontics", "whitening", "veneers"],
    blurb:
      "Bütçe dostu seçenekler ve net bilgilendirme. Plak/ortodonti planlaması, beyazlatma ve lamine süreçlerinde düzenli takip.",
    verified: false,
    badgeKey: null,
    badgeColor: null,
  },
  {
    id: 6,
    name: "GoldenSmile Bursa",
    location: "Nilüfer, Bursa",
    rating: 4.7,
    reviews: 412,
    specialties: ["implants", "root-canal"],
    blurb:
      "Güven veren klinik deneyimi: steril çalışma, açıklayıcı hekim iletişimi ve hızlı dönüş. İmplant ve kanal tedavisinde istikrarlı sonuçlar.",
    verified: true,
    badgeKey: null,
    badgeColor: null,
  },
];

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
  clinic: (typeof CLINICS)[number];
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
  const locale = useLocale();
  const [bookingOpen, setBookingOpen] = useState(false);

  return (
    <section id="clinics" className={`section ${styles.clinics}`}>
      <div className="container">
        {/* Header */}
        <header className="section-header">
          <div className="section-badge">
            <Building2 size={16} aria-hidden="true" style={{ display: "inline", marginRight: 6 }} />
            {tNav("clinics")}
          </div>
          <h2 className="section-title">
            {t("title").split(" ").slice(0, -1).join(" ")} <span>{t("title").split(" ").slice(-1)}</span>
          </h2>
          <p className="section-subtitle">{t("subtitle")}</p>
        </header>

        {/* Grid */}
        <div className={styles.grid} aria-label={tNav("clinics")}>
          {CLINICS.map((clinic) => (
            <ClinicCard
              key={clinic.id}
              clinic={clinic}
              t={t}
              tTreatments={tTreatments}
              onBook={() => setBookingOpen(true)}
            />
          ))}
        </div>

        {/* View All */}
        <div className={styles.viewAllWrap}>
          <button className="btn btn-ghost">
            {t("viewAll")}
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
      
      <BookingModal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} locale={locale} />
    </section>
  );
}
