"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Mail, Phone, UserRound } from "lucide-react";
import styles from "../../doctor/Dashboard.module.css";
import { sanitizeEmail, sanitizePhone, sanitizeText } from "@/lib/security";
import { readPatientProfile, writePatientProfile } from "@/lib/patientProfileStore";

export default function PatientProfilePage() {
  const t = useTranslations("panel.patient");
  const [profile, setProfile] = useState(() => readPatientProfile());
  const [saved, setSaved] = useState(false);

  const saveProfile = () => {
    writePatientProfile(profile);
    setSaved(true);
    setTimeout(() => setSaved(false), 1400);
  };

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
            <input
              className="input"
              value={profile.fullName}
              onChange={(e) => setProfile((prev) => ({ ...prev, fullName: sanitizeText(e.target.value, 80) }))}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: 6 }}>
              <Mail size={14} style={{ display: "inline", marginRight: 6 }} />
              {t("email")}
            </label>
            <input
              className="input"
              value={profile.email}
              onChange={(e) => setProfile((prev) => ({ ...prev, email: sanitizeEmail(e.target.value) }))}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: 6 }}>
              <Phone size={14} style={{ display: "inline", marginRight: 6 }} />
              {t("phone")}
            </label>
            <input
              className="input"
              value={profile.phone}
              onChange={(e) => setProfile((prev) => ({ ...prev, phone: sanitizePhone(e.target.value) }))}
            />
          </div>
        </div>

        <div style={{ marginTop: "1.25rem", display: "flex", justifyContent: "flex-end" }}>
          <button className="btn btn-primary" onClick={saveProfile}>
            {saved ? t("saved") : t("save")}
          </button>
        </div>
      </div>
    </div>
  );
}

