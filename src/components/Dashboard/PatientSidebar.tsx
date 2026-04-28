"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { CalendarDays, LayoutDashboard, LogOut, Settings, UserRound, Stethoscope } from "lucide-react";
import styles from "./Sidebar.module.css";

const MENU_ITEMS = [
  { href: "/patient", labelKey: "dashboard", icon: LayoutDashboard },
  { href: "/patient/appointments", labelKey: "myAppointments", icon: CalendarDays },
  { href: "/patient/profile", labelKey: "profile", icon: UserRound },
  { href: "/patient/settings", labelKey: "settings", icon: Settings },
];

export default function PatientSidebar({ locale }: { locale: string }) {
  const pathname = usePathname();
  const t = useTranslations("panel.common");

  return (
    <aside className={styles.sidebar}>
      <Link href={`/${locale}`} className={styles.brand}>
        <div className={styles.logoIcon}>
          <Stethoscope size={18} />
        </div>
        <span className={styles.logoText}>
          Trust<span className={styles.logoBrand}>Dent</span>
        </span>
      </Link>

      <nav className={styles.nav}>
        <div className={styles.menuLabel}>{t("patientMenu").toUpperCase()}</div>
        <ul className={styles.menuList}>
          {MENU_ITEMS.map((item) => {
            const isActive = pathname === `/${locale}${item.href}` || pathname === item.href;
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={`/${locale}${item.href}`}
                  className={`${styles.menuItem} ${isActive ? styles.active : ""}`}
                >
                  <Icon size={18} />
                  <span>{t(item.labelKey)}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className={styles.footer}>
        <button className={styles.logoutBtn}>
          <LogOut size={18} />
          <span>{t("logout")}</span>
        </button>
      </div>
    </aside>
  );
}

