"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Bell, Search, Menu, RotateCcw } from "lucide-react";
import { resetDemoAppointments } from "@/lib/demoAppointments";
import styles from "./Header.module.css";

type DashboardRole = "doctor" | "patient" | "admin";

export default function DashboardHeader({ role = "doctor" }: { role?: DashboardRole }) {
  const t = useTranslations("panel.header");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(() => searchParams.get("q") ?? "");

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      const normalized = searchValue.trim();
      const current = searchParams.get("q") ?? "";
      if (normalized === current) {
        return;
      }
      if (normalized) {
        params.set("q", normalized);
      } else {
        params.delete("q");
      }
      const next = params.toString();
      router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
    }, 180);

    return () => clearTimeout(timeout);
  }, [pathname, router, searchParams, searchValue]);

  const clearDemoData = () => {
    resetDemoAppointments();
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
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
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
