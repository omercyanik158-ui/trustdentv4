"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { CalendarDays, FileImage, LayoutDashboard, LogOut, Settings, Stethoscope, Users, Wallet } from "lucide-react";
import styles from "./Sidebar.module.css";

const MENU_ITEMS = [
  { href: "/doctor", labelKey: "dashboard", icon: LayoutDashboard },
  { href: "/doctor/appointments", labelKey: "appointments", icon: CalendarDays },
  { href: "/doctor/patients", labelKey: "myPatients", icon: Users },
  { href: "/doctor/radiology", labelKey: "radiology", icon: FileImage },
  { href: "/doctor/earnings", labelKey: "earnings", icon: Wallet },
  { href: "/doctor/settings", labelKey: "settings", icon: Settings },
];

export default function DoctorSidebar({ locale }: { locale: string }) {
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
        <div className={styles.menuLabel}>{t("doctorMenu").toUpperCase()}</div>
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

