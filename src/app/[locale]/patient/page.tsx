"use client";

import { useState, useEffect } from "react";
import { CalendarCheck, Clock, MapPin, Search } from "lucide-react";
import styles from "../doctor/Dashboard.module.css";

type Appointment = {
  id: number;
  treatment: string;
  clinic: string;
  date: string;
  time: string;
  status: string;
  createdAt: string;
};

export default function PatientDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const upcoming = appointments[0];

  useEffect(() => {
    const saved = localStorage.getItem("trustdent_appointments");
    if (saved) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setAppointments(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Hoş Geldiniz, Ahmet 👋</h1>
      <p className={styles.subtitle}>Yaklaşan randevularınız ve sağlık geçmişiniz burada.</p>

      {/* Patient Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={styles.statIcon} style={{ color: "#BC0A18", background: "rgba(188, 10, 24, 0.1)" }}>
              <CalendarCheck size={20} />
            </div>
          </div>
          <div className={styles.statValue}>{appointments.length}</div>
          <div className={styles.statLabel}>Toplam Randevu</div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={styles.statIcon} style={{ color: "#f59e0b", background: "rgba(245, 158, 11, 0.1)" }}>
              <Clock size={20} />
            </div>
          </div>
          <div className={styles.statValue}>
            {appointments.filter((a) => a.status === "Onay Bekliyor").length}
          </div>
          <div className={styles.statLabel}>Bekleyen Onay</div>
        </div>
      </div>

      <div className={styles.bottomGrid}>
        {/* Upcoming Highlight */}
        <div className={styles.chartCard}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Yaklaşan Randevu</h3>
            <a className={styles.viewAllBtn} href="./patient/appointments">
              Tümü
            </a>
          </div>
          {upcoming ? (
            <div style={{ display: "grid", gap: "0.75rem" }}>
              <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Tedavi</div>
              <div style={{ color: "var(--text-primary)", fontWeight: 900, fontSize: "1.05rem" }}>{upcoming.treatment}</div>
              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", color: "var(--text-secondary)" }}>
                <span>
                  <MapPin size={14} style={{ display: "inline", marginRight: 6 }} />
                  {upcoming.clinic || "Klinik atanmadı"}
                </span>
                <span>
                  <Clock size={14} style={{ display: "inline", marginRight: 6 }} />
                  {upcoming.date} · {upcoming.time}
                </span>
              </div>
              <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.25rem" }}>
                <a className="btn btn-primary btn-sm" href="./patient/appointments">
                  Detay
                </a>
                <button className="btn btn-ghost btn-sm">Destek</button>
              </div>
            </div>
          ) : (
            <div style={{ color: "var(--text-muted)" }}>Henüz yaklaşan randevu yok.</div>
          )}
        </div>

        {/* Appointments List */}
        <div className={styles.listCard} style={{ gridColumn: "1 / -1" }}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Randevularım</h3>
            <div className={styles.select}>
              <Search size={14} style={{ display: "inline", marginRight: 4 }} />
              Arama
            </div>
          </div>
          <div className={styles.list}>
            {appointments.length === 0 ? (
              <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
                Henüz bir randevunuz bulunmuyor.
              </div>
            ) : (
              appointments.map((apt) => (
                <div key={apt.id} className={styles.listItem}>
                  <div className={styles.timeBlock} style={{ width: "60px" }}>
                    <div style={{ fontSize: "1.1rem" }}>{apt.date.split("-")[2]}</div>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: "normal" }}>
                      {apt.time}
                    </div>
                  </div>
                  <div className={styles.itemInfo}>
                    <div className={styles.itemName}>{apt.treatment}</div>
                    <div className={styles.itemDesc}>
                      <MapPin size={12} style={{ display: "inline" }}/> {apt.clinic || "Klinik atanmadı"}
                    </div>
                  </div>
                  <div className={`${styles.statusBadge} ${styles.statusWarning}`}>
                    {apt.status}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
