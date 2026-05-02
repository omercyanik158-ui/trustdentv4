"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Bell, Search, Menu, RotateCcw } from "lucide-react";
import { resetDemoAppointments } from "@/lib/demoAppointments";
import { resetDemoRadiology } from "@/lib/demoRadiology";
import { resetPatientProfileStore } from "@/lib/patientProfileStore";
import {
  markAllNotificationsRead,
  markNotificationRead,
  readDemoNotifications,
  resetDemoNotifications,
  seedDemoNotifications,
  type NotificationRole,
} from "@/lib/demoNotifications";
import styles from "./Header.module.css";

type DashboardRole = "doctor" | "patient" | "admin";

export default function DashboardHeader({ role = "doctor" }: { role?: DashboardRole }) {
  const t = useTranslations("panel.header");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(() => searchParams.get("q") ?? "");
  const lastCommittedQueryRef = useRef(searchParams.get("q") ?? "");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState(() => {
    seedDemoNotifications();
    return readDemoNotifications();
  });
  const notificationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      const normalized = searchValue.trim();
      const current = searchParams.get("q") ?? "";
      if (normalized === current || normalized === lastCommittedQueryRef.current) {
        return;
      }
      if (normalized) {
        params.set("q", normalized);
      } else {
        params.delete("q");
      }
      const next = params.toString();
      lastCommittedQueryRef.current = normalized;
      router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
    }, 320);

    return () => clearTimeout(timeout);
  }, [pathname, router, searchParams, searchValue]);

  const clearDemoData = () => {
    resetDemoAppointments();
    resetDemoNotifications();
    resetDemoRadiology();
    resetPatientProfileStore();
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("trustdent_admin_decisions");
    }
    window.location.reload();
  };

  useEffect(() => {
    if (!notificationsOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      const root = notificationsRef.current;
      if (!root) return;
      if (!root.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [notificationsOpen]);

  const visibleNotifications = useMemo(() => {
    const targetRole = role as NotificationRole;
    return notifications.filter((item) => item.role === targetRole || item.role === "all").slice(0, 8);
  }, [notifications, role]);

  const unreadCount = useMemo(
    () => visibleNotifications.filter((item) => !item.read).length,
    [visibleNotifications]
  );

  const openNotifications = () => {
    setNotifications(readDemoNotifications());
    setNotificationsOpen((value) => !value);
  };

  const openNotification = (id: number, targetPath: string | null) => {
    setNotifications(markNotificationRead(id));
    if (!targetPath) {
      return;
    }
    setNotificationsOpen(false);
    router.push(`/${locale}${targetPath}`);
  };

  const markAllRead = () => {
    setNotifications(markAllNotificationsRead(role as NotificationRole));
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
        <div className={styles.notificationWrap} ref={notificationsRef}>
          <button className={styles.iconBtn} onClick={openNotifications} aria-label={t("notificationsTitle")}>
            <Bell size={18} />
            {unreadCount > 0 ? <span className={styles.badge}>{Math.min(unreadCount, 9)}</span> : null}
          </button>
          {notificationsOpen ? (
            <div className={styles.notificationPanel}>
              <div className={styles.notificationHeader}>
                <span>{t("notificationsTitle")}</span>
                <button
                  type="button"
                  className={styles.notificationAction}
                  onClick={markAllRead}
                  disabled={visibleNotifications.length === 0}
                >
                  {t("markAllRead")}
                </button>
              </div>
              <div className={styles.notificationList}>
                {visibleNotifications.length === 0 ? (
                  <div className={styles.notificationEmpty}>{t("noNotifications")}</div>
                ) : (
                  visibleNotifications.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={`${styles.notificationItem} ${item.read ? "" : styles.notificationUnread}`}
                      onClick={() => openNotification(item.id, item.targetPath)}
                    >
                      <div className={styles.notificationTitle}>{item.title}</div>
                      <div className={styles.notificationMessage}>{item.message}</div>
                      <div className={styles.notificationMeta}>
                        {new Intl.DateTimeFormat(locale, {
                          hour: "2-digit",
                          minute: "2-digit",
                          day: "2-digit",
                          month: "short",
                        }).format(new Date(item.createdAt))}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          ) : null}
        </div>
        
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
