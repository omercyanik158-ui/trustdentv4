"use client";

import { useTranslations } from "next-intl";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { Quote, Star, Stethoscope, Building2 } from "lucide-react";
import styles from "./DoctorsPage.module.css";

const DOCTORS = [
  {
    id: 1,
    name: "Dr. Ayşe Demir",
    title: "İmplantoloji Uzmanı",
    clinic: "DentaLux İstanbul",
    rating: 4.9,
    reviews: 428,
    review:
      "Süreç baştan sona çok şeffaftı. Doktorum her adımı detaylıca anlattı ve sonuç beklediğimden bile daha doğal oldu. Kendisine ve ekibine güleryüzlü yaklaşımları için çok teşekkür ederim.",
    initials: "AD",
  },
  {
    id: 2,
    name: "Dr. Caner Yılmaz",
    title: "Estetik Diş Hekimi",
    clinic: "Smile Clinic Antalya",
    rating: 4.8,
    reviews: 312,
    review:
      "İletişim mükemmeldi ve tüm ekip süreç boyunca çok ilgiliydi. Tedavi planı son derece netti ve randevular tam zamanında gerçekleşti. Modern teknolojileri sayesinde kendimi çok güvende hissettim.",
    initials: "CY",
  },
  {
    id: 3,
    name: "Dr. Selin Kaya",
    title: "Ortodontist",
    clinic: "PearlDent Ankara",
    rating: 5.0,
    reviews: 186,
    review:
      "Şeffaf plak sürecinde her aşamada detaylıca bilgilendirildim. Kontroller son derece düzenliydi ve çok kısa sürede gülüşümde ciddi farklar gördüm. Kesinlikle profesyonel bir yaklaşım.",
    initials: "SK",
  },
  {
    id: 4,
    name: "Dr. Mehmet Arslan",
    title: "Protetik Diş Tedavisi",
    clinic: "Istanbul Dental Center",
    rating: 4.9,
    reviews: 245,
    review:
      "Detaycı yaklaşımı ve sunduğu premium malzeme seçenekleriyle harika bir deneyimdi. Sonuçlar estetik açıdan mükemmel ve kullanım konforu çok yüksek. Herkese gönül rahatlığıyla tavsiye ederim.",
    initials: "MA",
  },
  {
    id: 5,
    name: "Dr. Elif Şahin",
    title: "Endodonti",
    clinic: "MedDent İzmir",
    rating: 4.7,
    reviews: 156,
    review:
      "Ağrısız ve oldukça konforlu bir tedavi süreci geçirdim. Her kontrol sonrasında neyin neden yapıldığını net şekilde öğrendim ve kendimi emin ellerde hissettim. Başarılı bir ekip.",
    initials: "EŞ",
  },
  {
    id: 6,
    name: "Dr. Deniz Acar",
    title: "Estetik Uygulamalar",
    clinic: "GoldenSmile Bursa",
    rating: 4.8,
    reviews: 214,
    review:
      "Beyazlatma sonrası elde edilen sonuç çok doğal ve parlak kaldı. Küçük dokunuşlarla gülüşümde ciddi bir iyileşme sağlandı. Profesyonel bakış açısı ve ilgi alaka için teşekkürler.",
    initials: "DA",
  },
];

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
                          <span className={`${styles.pill} ${styles.pillClinic}`} title={d.clinic}>
                            <Building2 size={12} strokeWidth={2.5} />
                            <span>{d.clinic}</span>
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
                    <span className={styles.ratingCount}>({d.reviews} {t("reviews" as any)})</span>
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
