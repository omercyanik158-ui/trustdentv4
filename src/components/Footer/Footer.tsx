"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Mail, Phone, MapPin, Share2, Heart, Link2, MessageCircle, Shield, CheckCircle } from "lucide-react";
import styles from "./Footer.module.css";

const SOCIAL_ICONS = [Share2, Heart, Link2, MessageCircle];

export default function Footer() {
  const locale = useLocale();
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const tTreatments = useTranslations("treatments");

  return (
    <footer id="footer" className={styles.footer}>

      <div className={styles.main}>
        <div className="container">
          <div className={styles.grid}>
            {/* Brand */}
            <div className={styles.brand}>
              <Link href={`/${locale}`} className={styles.logo}>
                <Image src="/logo_simple.svg" alt="TrustDent" className={styles.logoImg} width={32} height={32} />
                <div className={styles.logoMark}>
                  <span className={styles.logoText}>Trust Dent</span>
                  <span className={styles.logoBrand}>Türkiye</span>
                </div>
              </Link>
              <p className={styles.brandDesc}>{t("description")}</p>
              <div className={styles.socials}>
                {SOCIAL_ICONS.map((Icon, i) => (
                  <a
                    key={i}
                    href="https://www.instagram.com"
                    target="_blank"
                    rel="noreferrer"
                    className={styles.socialLink}
                    aria-label={t("social")}
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
              <div className={styles.contact}>
                <div className={styles.contactItem}>
                  <Mail size={14} />
                  <a href="mailto:info@trustdent.com">info@trustdent.com</a>
                </div>
                <div className={styles.contactItem}>
                  <Phone size={14} />
                  <a href="tel:+902120000000">+90 212 000 00 00</a>
                </div>
                <div className={styles.contactItem}>
                  <MapPin size={14} />
                  <span>İstanbul, Türkiye</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className={styles.col}>
              <h3 className={styles.colTitle}>{t("quickLinks")}</h3>
              <ul className={styles.colLinks}>
                {[
                  { key: "home", href: `/${locale}` },
                  { key: "clinics", href: `/${locale}/clinics` },
                  { key: "doctors", href: `/${locale}/doctors` },
                  { key: "treatments", href: `/${locale}/treatments` },
                  { key: "about", href: `/${locale}/about` },
                  { key: "contact", href: `/${locale}#footer` },
                ].map((item) => (
                  <li key={item.key}>
                    <Link href={item.href} className={styles.colLink}>{tNav(item.key)}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Treatments */}
            <div className={styles.col}>
              <h3 className={styles.colTitle}>{t("treatments")}</h3>
              <ul className={styles.colLinks}>
                {["implants", "veneers", "zirconia", "whitening", "orthodontics", "root-canal"].map((id) => (
                  <li key={id}>
                    <Link href={`/${locale}/treatments`} className={styles.colLink}>
                      {tTreatments(`${id}.title`)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div className={styles.col}>
              <h3 className={styles.colTitle}>{t("support")}</h3>
              <ul className={styles.colLinks}>
                {[
                  { key: "faq", label: t("faq") },
                  { key: "privacyPolicy", label: t("privacyPolicy") },
                  { key: "terms", label: t("terms") },
                  { key: "cookiePolicy", label: t("cookiePolicy") },
                  { key: "blog", label: t("blog") },
                  { key: "careers", label: t("careers") },
                ].map((item) => (
                  <li key={item.key}>
                    <Link href={`/${locale}#footer`} className={styles.colLink}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className={styles.bottom}>
            <p className={styles.copyright}>{t("copyright")}</p>
            <div className={styles.bottomRight}>
              <span className={styles.trust}><Shield size={14} color="var(--gold)" /> {t("sslSecure")}</span>
              <span className={styles.trust}><CheckCircle size={14} color="var(--primary)" /> {t("compliance")}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
