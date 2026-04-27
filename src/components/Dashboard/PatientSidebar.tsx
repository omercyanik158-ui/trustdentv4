"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, LayoutDashboard, LogOut, Settings, UserRound, Stethoscope } from "lucide-react";
import styles from "./Sidebar.module.css";

const MENU_ITEMS = [
  { href: "/patient", label: "Dashboard", icon: LayoutDashboard },
  { href: "/patient/appointments", label: "Randevularım", icon: CalendarDays },
  { href: "/patient/profile", label: "Profil", icon: UserRound },
  { href: "/patient/settings", label: "Ayarlar", icon: Settings },
];

export default function PatientSidebar({ locale }: { locale: string }) {
  const pathname = usePathname();

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
        <div className={styles.menuLabel}>HASTA</div>
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
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className={styles.footer}>
        <button className={styles.logoutBtn}>
          <LogOut size={18} />
          <span>Çıkış Yap</span>
        </button>
      </div>
    </aside>
  );
}

