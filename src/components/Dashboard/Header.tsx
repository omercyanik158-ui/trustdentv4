"use client";

import { Bell, Search, Menu } from "lucide-react";
import styles from "./Header.module.css";

export default function DashboardHeader() {
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
            placeholder="Hasta, randevu veya işlem ara..." 
            className={styles.searchInput}
          />
        </div>
      </div>

      <div className={styles.right}>
        <button className={styles.iconBtn}>
          <Bell size={18} />
          <span className={styles.badge}>3</span>
        </button>
        
        <div className={styles.profile}>
          <div className={styles.avatar}>Dr</div>
          <div className={styles.info}>
            <div className={styles.name}>Dr. Ayşe Kaya</div>
            <div className={styles.role}>İmplantoloji</div>
          </div>
        </div>
      </div>
    </header>
  );
}
