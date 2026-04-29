"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Activity, LayoutDashboard, LogOut, Settings, ShieldCheck, Stethoscope, Users } from "lucide-react";
import styles from "./Sidebar.module.css";

const MENU_ITEMS = [
  { section: "dashboard", labelKey: "dashboard", icon: LayoutDashboard },
  { section: "users", labelKey: "usersAndClinics", icon: Users },
  { section: "activity", labelKey: "activity", icon: Activity },
  { section: "settings", labelKey: "settings", icon: Settings },
];

export default function AdminSidebar({ locale }: { locale: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("panel.admin");
  const tc = useTranslations("panel.common");
  const currentSection = searchParams.get("section") ?? "dashboard";
  const currentQuery = searchParams.get("q");

  const buildSectionHref = (section: string) => {
    const params = new URLSearchParams();
    params.set("section", section);
    if (currentQuery) {
      params.set("q", currentQuery);
    }
    return `/${locale}/admin?${params.toString()}`;
  };

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
            const href = buildSectionHref(item.section);
            const isActive =
              (pathname === `/${locale}/admin` || pathname === "/admin") && currentSection === item.section;
            const Icon = item.icon;

            return (
              <li key={item.labelKey}>
                <button
                  className={`${styles.menuItem} ${isActive ? styles.active : ""}`}
                  onClick={() => router.push(href)}
                >
                  <Icon size={18} />
                  <span>{t(item.labelKey)}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className={styles.footer}>
        <button className={styles.logoutBtn} onClick={() => router.push(`/${locale}`)}>
          <LogOut size={18} />
          <span>{tc("logout")}</span>
        </button>
      </div>

      <div className={styles.footer} style={{ marginTop: "0.5rem" }}>
        <button className={styles.logoutBtn} onClick={() => router.push(buildSectionHref("dashboard"))}>
          <ShieldCheck size={18} />
          <span>{t("adminMode")}</span>
        </button>
      </div>
    </aside>
  );
}
