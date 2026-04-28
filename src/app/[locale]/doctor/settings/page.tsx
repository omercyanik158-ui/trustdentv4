"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Building2, Mail, Phone, Stethoscope } from "lucide-react";
import styles from "../Dashboard.module.css";

export default function DoctorSettingsPage() {
  const t = useTranslations("panel.doctor");
  const [name, setName] = useState("Dr. Ayşe Demir");
  const [clinic, setClinic] = useState("DentaLux İstanbul");
  const [specialty, setSpecialty] = useState("İmplantoloji");
  const [phone, setPhone] = useState("+90 555 123 4567");
  const [email, setEmail] = useState("ayse.demir@trustdent.com");

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t("settingsTitle")}</h1>
      <p className={styles.subtitle}>{t("settingsSubtitle")}</p>

      <div className={styles.listCard} style={{ gridColumn: "1 / -1" }}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>{t("profile")}</h3>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: 6 }}>
              {t("fullName")}
            </label>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: 6 }}>
              <Stethoscope size={14} style={{ display: "inline", marginRight: 6 }} />
              {t("specialty")}
            </label>
            <input className="input" value={specialty} onChange={(e) => setSpecialty(e.target.value)} />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: 6 }}>
              <Building2 size={14} style={{ display: "inline", marginRight: 6 }} />
              {t("clinic")}
            </label>
            <input className="input" value={clinic} onChange={(e) => setClinic(e.target.value)} />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: 6 }}>
              <Phone size={14} style={{ display: "inline", marginRight: 6 }} />
              {t("phone")}
            </label>
            <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: 6 }}>
              <Mail size={14} style={{ display: "inline", marginRight: 6 }} />
              {t("email")}
            </label>
            <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </div>

        <div style={{ marginTop: "1.25rem", display: "flex", justifyContent: "flex-end" }}>
          <button className="btn btn-primary">{t("save")}</button>
        </div>
      </div>
    </div>
  );
}

