"use client";

import { useTranslations } from "next-intl";
import { Users, Activity, MousePointerClick, Globe } from "lucide-react";
import styles from "../doctor/Dashboard.module.css"; // Reuse the doctor styles for layout

export default function AdminDashboard() {
  const t = useTranslations("panel.admin");

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t("title")}</h1>
      <p className={styles.subtitle}>{t("subtitle")}</p>

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
          <div className={styles.statLabel}>{t("totalRegisteredPatients")}</div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={styles.statIcon} style={{ color: "#10b981", background: "rgba(16, 185, 129, 0.1)" }}>
              <Activity size={20} />
            </div>
            <span className={styles.statBadge}>+12%</span>
          </div>
          <div className={styles.statValue}>85</div>
          <div className={styles.statLabel}>{t("activeDoctors")}</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={styles.statIcon} style={{ color: "#f59e0b", background: "rgba(245, 158, 11, 0.1)" }}>
              <MousePointerClick size={20} />
            </div>
            <span className={styles.statBadge}>+5%</span>
          </div>
          <div className={styles.statValue}>45.2K</div>
          <div className={styles.statLabel}>{t("monthlyVisits")}</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={styles.statIcon} style={{ color: "#ec4899", background: "rgba(236, 72, 153, 0.1)" }}>
              <Globe size={20} />
            </div>
          </div>
          <div className={styles.statValue}>12</div>
          <div className={styles.statLabel}>{t("internationalLeads")}</div>
        </div>
      </div>

      <div className={styles.bottomGrid}>
        {/* Recent Activity */}
        <div className={styles.listCard} style={{ gridColumn: "1 / -1" }}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>{t("recentActivities")}</h3>
          </div>
          <div className={styles.list}>
            {[
              { id: 1, action: t("newAppointmentRequest"), user: "John Doe (UK)", time: t("minutesAgo", { count: 5 }), type: "primary" },
              { id: 2, action: t("clinicApprovalPending"), user: "Smile Center", time: t("hoursAgo", { count: 1 }), type: "warning" },
              { id: 3, action: t("newDoctorSignup"), user: "Dr. Caner", time: t("hoursAgo", { count: 3 }), type: "success" },
            ].map((item) => (
              <div key={item.id} className={styles.listItem}>
                <div className={styles.timeBlock}>{item.time}</div>
                <div className={styles.itemInfo}>
                  <div className={styles.itemName}>{item.action}</div>
                  <div className={styles.itemDesc}>{item.user}</div>
                </div>
                <button className={`btn btn-sm ${item.type === 'primary' ? 'btn-primary' : 'btn-ghost'}`}>
                  {t("review")}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
