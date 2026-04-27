"use client";

import { useEffect, useMemo, useState } from "react";
import { MapPin, RefreshCw, XCircle } from "lucide-react";
import styles from "../../doctor/Dashboard.module.css";

type Appointment = {
  id: number;
  treatment: string;
  clinic: string;
  date: string;
  time: string;
  status: string;
  createdAt: string;
};

export default function PatientAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("trustdent_appointments");
    if (!saved) return;
    try {
      setAppointments(JSON.parse(saved));
    } catch (e) {
      console.error(e);
    }
  }, []);

  const sorted = useMemo(() => {
    return [...appointments].sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
  }, [appointments]);

  const updateStatus = (id: number, status: string) => {
    setAppointments((prev) => {
      const next = prev.map((a) => (a.id === id ? { ...a, status } : a));
      localStorage.setItem("trustdent_appointments", JSON.stringify(next));
      return next;
    });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Randevularım</h1>
      <p className={styles.subtitle}>Taleplerinizi takip edin, gerektiğinde yeniden planlayın veya iptal edin.</p>

      <div className={styles.listCard} style={{ gridColumn: "1 / -1" }}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>Liste</h3>
        </div>

        <div className={styles.list}>
          {sorted.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
              Henüz bir randevunuz bulunmuyor.
            </div>
          ) : (
            sorted.map((apt) => (
              <div key={apt.id} className={styles.listItem}>
                <div className={styles.timeBlock} style={{ width: 70 }}>
                  <div style={{ fontSize: "0.95rem" }}>{apt.date}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>{apt.time}</div>
                </div>
                <div className={styles.itemInfo}>
                  <div className={styles.itemName}>{apt.treatment}</div>
                  <div className={styles.itemDesc}>
                    <MapPin size={12} style={{ display: "inline" }} /> {apt.clinic || "Klinik atanmadı"}
                  </div>
                </div>
                <div className={`${styles.statusBadge} ${styles.statusWarning}`}>{apt.status}</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    className="btn btn-sm btn-ghost"
                    onClick={() => updateStatus(apt.id, "Onay Bekliyor")}
                    style={{ padding: "0.55rem 0.9rem" }}
                  >
                    <RefreshCw size={16} /> Yeniden Planla
                  </button>
                  <button
                    className="btn btn-sm btn-ghost"
                    onClick={() => updateStatus(apt.id, "İptal")}
                    style={{ padding: "0.55rem 0.9rem" }}
                  >
                    <XCircle size={16} /> İptal
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

