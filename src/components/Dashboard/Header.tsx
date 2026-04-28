"use client";

import { useTranslations } from "next-intl";
import { Bell, Search, Menu, RotateCcw } from "lucide-react";
import styles from "./Header.module.css";

type DashboardRole = "doctor" | "patient" | "admin";

export default function DashboardHeader({ role = "doctor" }: { role?: DashboardRole }) {
  const t = useTranslations("panel.header");
  const clearDemoData = () => {
    localStorage.removeItem("trustdent_appointments");
    window.location.reload();
  };

  const profile = {
    doctor: {
      avatar: "Dr",
      name: t("demoDoctorName"),
      role: t("demoDoctorRole"),
    },
    patient: {
      avatar: "PT",
      name: t("demoPatientName"),
      role: t("demoPatientRole"),
    },
    admin: {
      avatar: "AD",
      name: t("demoAdminName"),
      role: t("demoAdminRole"),
    },
  }[role];

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <button className={styles.menuBtn}>
          <Menu size={20} />
        </button>
        <div className={styles.searchWrap}>
          <Search size={16} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder={t("searchPlaceholder")}
            className={styles.searchInput}
          />
        </div>
      </div>

      <div className={styles.right}>
        <button className={styles.resetBtn} onClick={clearDemoData} title={t("resetDemoTitle")}>
          <RotateCcw size={14} />
          <span>{t("resetDemo")}</span>
        </button>
        <button className={styles.iconBtn}>
          <Bell size={18} />
          <span className={styles.badge}>3</span>
        </button>
        
        <div className={styles.profile}>
          <div className={styles.avatar}>{profile.avatar}</div>
          <div className={styles.info}>
            <div className={styles.name}>{profile.name}</div>
            <div className={styles.role}>{profile.role}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
