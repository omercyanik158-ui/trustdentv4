"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { Activity, LayoutDashboard, LogOut, Settings, ShieldCheck, Stethoscope, Users } from "lucide-react";
import styles from "./Sidebar.module.css";

const MENU_ITEMS = [
  { href: "/admin", labelKey: "dashboard", icon: LayoutDashboard },
  { href: "/admin", labelKey: "usersAndClinics", icon: Users },
  { href: "/admin", labelKey: "activity", icon: Activity },
  { href: "/admin", labelKey: "settings", icon: Settings },
];

export default function AdminSidebar({ locale }: { locale: string }) {
  const pathname = usePathname();
  const t = useTranslations("panel.admin");
  const tc = useTranslations("panel.common");

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
        <div className={styles.menuLabel}>{tc("adminMenu").toUpperCase()}</div>
        <ul className={styles.menuList}>
          {MENU_ITEMS.map((item) => {
            const isActive = pathname === `/${locale}${item.href}` || pathname === item.href;
            const Icon = item.icon;

            return (
              <li key={item.labelKey}>
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
          <span>{tc("logout")}</span>
        </button>
      </div>

      <div className={styles.footer} style={{ marginTop: "0.5rem" }}>
        <button className={styles.logoutBtn}>
          <ShieldCheck size={18} />
          <span>{t("adminMode")}</span>
        </button>
      </div>
    </aside>
  );
}
