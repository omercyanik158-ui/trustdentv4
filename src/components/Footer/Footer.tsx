"use client";

import { useTranslations } from "next-intl";
import { Stethoscope, Mail, Phone, MapPin, Share2, Heart, Link2, MessageCircle, Shield, CheckCircle } from "lucide-react";
import styles from "./Footer.module.css";

const SOCIAL_ICONS = [Share2, Heart, Link2, MessageCircle];

export default function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const tTreatments = useTranslations("treatments");

  return (
    <footer className={styles.footer}>

      <div className={styles.main}>
        <div className="container">
          <div className={styles.grid}>
            {/* Brand */}
            <div className={styles.brand}>
              <div className={styles.logo}>
                <img src="/logo_simple.svg" alt="TrustDent" className={styles.logoImg} />
                <div className={styles.logoMark}>
                  <span className={styles.logoText}>Trust Dent</span>
                  <span className={styles.logoBrand}>Türkiye</span>
                </div>
              </div>
              <p className={styles.brandDesc}>{t("description")}</p>
              <div className={styles.socials}>
                {SOCIAL_ICONS.map((Icon, i) => (
                  <a key={i} href="#" className={styles.socialLink} aria-label="Social">
                    <Icon size={16} />
                  </a>
                ))}
              </div>
              <div className={styles.contact}>
                <div className={styles.contactItem}>
                  <Mail size={14} />
                  <span>info@trustdent.com</span>
                </div>
                <div className={styles.contactItem}>
                  <Phone size={14} />
                  <span>+90 212 000 00 00</span>
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
                {["home", "clinics", "doctors", "treatments", "about", "contact"].map((key) => (
                  <li key={key}>
                    <a href="#" className={styles.colLink}>{tNav(key)}</a>
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
                    <a href="#" className={styles.colLink}>{tTreatments(`${id}.title`)}</a>
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
                    <a href="#" className={styles.colLink}>{item.label}</a>
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
