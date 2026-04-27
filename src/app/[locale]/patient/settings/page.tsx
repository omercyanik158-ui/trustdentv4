"use client";

import styles from "../../doctor/Dashboard.module.css";

export default function PatientSettingsPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Ayarlar</h1>
      <p className={styles.subtitle}>Bildirimler ve tercihlerinizi yönetin. (Demo)</p>

      <div className={styles.listCard} style={{ gridColumn: "1 / -1" }}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>Tercihler</h3>
        </div>

        <div style={{ display: "grid", gap: "0.75rem" }}>
          {[
            { title: "SMS Bildirimleri", desc: "Randevu güncellemeleri için SMS al." },
            { title: "E-posta Bildirimleri", desc: "Onay ve hatırlatmaları e-posta ile al." },
            { title: "VIP Destek", desc: "Öncelikli destek kanalını aktif et." },
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
                Değiştir
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

