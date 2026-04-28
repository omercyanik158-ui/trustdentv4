"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { useLocale } from "next-intl";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import styles from "@/components/About/AboutPage.module.css";
import { motion } from "framer-motion";

export default function AboutPage() {
  const locale = useLocale();
  const tNav = useTranslations("nav");
  const t = useTranslations("about");
  return (
    <>
      <Navbar />
      <main className={styles.page}>
        <div className="container">
          <section className={styles.hero}>
            <div className={styles.copy}>
              <div className={styles.kicker}>{tNav("about")}</div>
              <h1 className={styles.title}>
                {t("title").split(" ").slice(0, -1).join(" ")} <span>{t("title").split(" ").slice(-1)}</span>
              </h1>
              <p className={styles.longText}>{t("longText")}</p>
              <p className={styles.lead}>{t("lead")}</p>

              <div className={styles.heroCtas}>
                <Link className="btn btn-primary" href="#about-features">
                  {t("ctaPrimary")}
                </Link>
                <Link className="btn btn-ghost" href={`/${locale}#clinics`}>
                  {t("ctaSecondary")}
                </Link>
              </div>
            </div>

            <div className={styles.logoVisualizer}>
              <div className={styles.logoWrapper}>
                <Image src="/logo_simple.svg" alt="TrustDent" className={styles.logoImgLarge} width={96} height={96} />
                <div className={styles.logoMarkLarge}>
                  <span className={styles.logoTextLarge}>Trust Dent</span>
                  <span className={styles.logoBrandLarge}>Türkiye</span>
                </div>
              </div>
            </div>
          </section>

          <section id="about-features" className={styles.featureGrid} aria-label={t("featuresAria")}>
            {[
              { k: "curated" },
              { k: "transparent" },
              { k: "support" },
              { k: "security" },
              { k: "matching" },
              { k: "aftercare" },
            ].map((item, idx) => (
              <motion.article
                key={item.k}
                className={styles.feature}
                initial={{ opacity: 0, y: 14, scale: 0.985 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.55, delay: Math.min(idx * 0.06, 0.24), ease: [0.16, 1, 0.3, 1] }}
              >
                <h2 className={styles.featureTitle}>{t(`features.${item.k}Title`)}</h2>
                <p className={styles.featureText}>{t(`features.${item.k}Text`)}</p>
              </motion.article>
            ))}
          </section>

          <motion.section
            className={styles.bottomMotion}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            aria-label={t("bottomAria")}
          >
            <div className={styles.bottomCard}>
              <h2 className={styles.bottomTitle}>{t("bottomTitle")}</h2>
              <p className={styles.bottomText}>{t("bottomText")}</p>
            </div>
          </motion.section>
        </div>
      </main>
      <Footer />
    </>
  );
}
