"use client";

import { Users, Activity, MousePointerClick, Globe } from "lucide-react";
import styles from "../doctor/Dashboard.module.css"; // Reuse the doctor styles for layout

export default function AdminDashboard() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Yönetici Paneli ⚙️</h1>
      <p className={styles.subtitle}>Tüm site istatistikleri ve genel hareketlilikler.</p>

      {/* Admin Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={styles.statIcon} style={{ color: "#3b82f6", background: "rgba(59, 130, 246, 0.1)" }}>
              <Users size={20} />
            </div>
            <span className={styles.statBadge}>+24%</span>
          </div>
          <div className={styles.statValue}>1,204</div>
          <div className={styles.statLabel}>Toplam Kayıtlı Hasta</div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={styles.statIcon} style={{ color: "#10b981", background: "rgba(16, 185, 129, 0.1)" }}>
              <Activity size={20} />
            </div>
            <span className={styles.statBadge}>+12%</span>
          </div>
          <div className={styles.statValue}>85</div>
          <div className={styles.statLabel}>Aktif Doktorlar</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={styles.statIcon} style={{ color: "#f59e0b", background: "rgba(245, 158, 11, 0.1)" }}>
              <MousePointerClick size={20} />
            </div>
            <span className={styles.statBadge}>+5%</span>
          </div>
          <div className={styles.statValue}>45.2K</div>
          <div className={styles.statLabel}>Aylık Site Ziyareti</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={styles.statIcon} style={{ color: "#ec4899", background: "rgba(236, 72, 153, 0.1)" }}>
              <Globe size={20} />
            </div>
          </div>
          <div className={styles.statValue}>12</div>
          <div className={styles.statLabel}>Farklı Ülkeden Talep</div>
        </div>
      </div>

      <div className={styles.bottomGrid}>
        {/* Recent Activity */}
        <div className={styles.listCard} style={{ gridColumn: "1 / -1" }}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Son Hareketlilikler</h3>
          </div>
          <div className={styles.list}>
            {[
              { id: 1, action: "Yeni randevu talebi", user: "John Doe (UK)", time: "5 dk önce", type: "primary" },
              { id: 2, action: "Klinik onayı bekliyor", user: "Smile Center", time: "1 saat önce", type: "warning" },
              { id: 3, action: "Yeni doktor kaydı", user: "Dr. Caner", time: "3 saat önce", type: "success" },
            ].map((item) => (
              <div key={item.id} className={styles.listItem}>
                <div className={styles.timeBlock}>{item.time}</div>
                <div className={styles.itemInfo}>
                  <div className={styles.itemName}>{item.action}</div>
                  <div className={styles.itemDesc}>{item.user}</div>
                </div>
                <button className={`btn btn-sm ${item.type === 'primary' ? 'btn-primary' : 'btn-ghost'}`}>
                  İncele
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
