"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Mail, Phone, UserRound } from "lucide-react";
import styles from "../../doctor/Dashboard.module.css";

export default function PatientProfilePage() {
  const t = useTranslations("panel.patient");
  const [name, setName] = useState("Ahmet Yılmaz");
  const [email, setEmail] = useState("ahmet@example.com");
  const [phone, setPhone] = useState("+90 555 123 4567");

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t("profileTitle")}</h1>
      <p className={styles.subtitle}>{t("profileSubtitle")}</p>

      <div className={styles.listCard} style={{ gridColumn: "1 / -1" }}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>{t("info")}</h3>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: 6 }}>
              <UserRound size={14} style={{ display: "inline", marginRight: 6 }} />
              {t("fullName")}
            </label>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: 6 }}>
              <Mail size={14} style={{ display: "inline", marginRight: 6 }} />
              {t("email")}
            </label>
            <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: 6 }}>
              <Phone size={14} style={{ display: "inline", marginRight: 6 }} />
              {t("phone")}
            </label>
            <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
        </div>

        <div style={{ marginTop: "1.25rem", display: "flex", justifyContent: "flex-end" }}>
          <button className="btn btn-primary">{t("save")}</button>
        </div>
      </div>
    </div>
  );
}

