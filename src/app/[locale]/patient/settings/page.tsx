"use client";

import { useTranslations } from "next-intl";
import styles from "../../doctor/Dashboard.module.css";

export default function PatientSettingsPage() {
  const t = useTranslations("panel.patient");
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t("settingsTitle")}</h1>
      <p className={styles.subtitle}>{t("settingsSubtitle")}</p>

      <div className={styles.listCard} style={{ gridColumn: "1 / -1" }}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>{t("preferences")}</h3>
        </div>

        <div style={{ display: "grid", gap: "0.75rem" }}>
          {[
            { title: t("smsNotifications"), desc: t("smsNotificationsDesc") },
            { title: t("emailNotifications"), desc: t("emailNotificationsDesc") },
            { title: t("vipSupport"), desc: t("vipSupportDesc") },
          ].map((item) => (
            <div
              key={item.title}
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "1rem",
                alignItems: "center",
                padding: "0.9rem",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
                background: "var(--bg-subtle)",
              }}
            >
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 800, color: "var(--text-primary)" }}>{item.title}</div>
                <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>{item.desc}</div>
              </div>
              <button className="btn btn-sm btn-ghost" style={{ padding: "0.55rem 0.9rem" }}>
                {t("change")}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

