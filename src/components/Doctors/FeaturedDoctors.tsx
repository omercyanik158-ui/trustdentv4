"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, Quote, Stethoscope, Star, Building2 } from "lucide-react";
import styles from "./FeaturedDoctors.module.css";

const DOCTORS = [
  {
    id: 1,
    name: "Dr. Ayşe Demir",
    clinic: "DentaLux İstanbul",
    title: "İmplantoloji Uzmanı",
    initials: "AD",
    rating: 4.9,
    review:
      "Süreç baştan sona çok şeffaftı. Doktorum her adımı detaylıca anlattı ve sonuç beklediğimden bile daha doğal oldu. Kendisine ve ekibine güleryüzlü yaklaşımları için çok teşekkür ederim.",
  },
  {
    id: 2,
    name: "Dr. Caner Yılmaz",
    clinic: "Smile Clinic Antalya",
    title: "Estetik Diş Hekimi",
    initials: "CY",
    rating: 4.8,
    review:
      "İletişim mükemmeldi ve tüm ekip süreç boyunca çok ilgiliydi. Tedavi planı son derece netti ve randevular tam zamanında gerçekleşti. Modern teknolojileri sayesinde kendimi çok güvende hissettim.",
  },
  {
    id: 3,
    name: "Dr. Selin Kaya",
    clinic: "PearlDent Ankara",
    title: "Ortodontist",
    initials: "SK",
    rating: 5.0,
    review:
      "Şeffaf plak sürecinde her aşamada detaylıca bilgilendirildim. Kontroller son derece düzenliydi ve çok kısa sürede gülüşümde ciddi farklar gördüm. Kesinlikle profesyonel bir yaklaşım.",
  },
  {
    id: 4,
    name: "Dr. Mehmet Arslan",
    clinic: "Istanbul Dental Center",
    title: "Protetik Diş Tedavisi",
    initials: "MA",
    rating: 4.9,
    review:
      "Detaycı yaklaşımı ve sunduğu premium malzeme seçenekleriyle harika bir deneyimdi. Sonuçlar estetik açıdan mükemmel ve kullanım konforu çok yüksek. Herkese gönül rahatlığıyla tavsiye ederim.",
  },
  {
    id: 5,
    name: "Dr. Elif Şahin",
    clinic: "MedDent İzmir",
    title: "Endodonti",
    initials: "EŞ",
    rating: 4.7,
    review:
      "Ağrısız ve oldukça konforlu bir tedavi süreci geçirdim. Her kontrol sonrasında neyin neden yapıldığını net şekilde öğrendim ve kendimi emin ellerde hissettim. Başarılı bir ekip.",
  },
  {
    id: 6,
    name: "Dr. Deniz Acar",
    clinic: "GoldenSmile Bursa",
    title: "Estetik Uygulamalar",
    initials: "DA",
    rating: 4.8,
    review:
      "Beyazlatma sonrası elde edilen sonuç çok doğal ve parlak kaldı. Küçük dokunuşlarla gülüşümde ciddi bir iyileşme sağlandı. Profesyonel bakış açısı ve ilgi alaka için teşekkürler.",
  },
];

export default function FeaturedDoctors() {
  const t = useTranslations("doctors");
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
                      <p className={styles.meta} title={`${d.title} · ${d.clinic}`}>
                        <span className={`${styles.metaText} ${styles.metaSpecialty}`}>
                          <Stethoscope size={11} strokeWidth={2.5} />
                          {d.title}
                        </span>
                        <span className={styles.dot} aria-hidden="true">
                          ·
                        </span>
                        <span className={`${styles.metaText} ${styles.metaClinic}`}>
                          <Building2 size={11} strokeWidth={2.5} />
                          {d.clinic}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </header>

              <div className={styles.cardBd}>
                <div className={styles.ratingRow} aria-label="Rating">
                  <span className={styles.stars} aria-hidden="true">
                    <Star size={14} />
                  </span>
                  <span className={styles.ratingValue}>{d.rating.toFixed(1)}</span>
                  <span className={styles.ratingCount}>(250+ {t("reviews")})</span>
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

