"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Clock, Filter, MapPin } from "lucide-react";
import styles from "../Dashboard.module.css";

type Appointment = {
  id: number;
  treatment: string;
  clinic: string;
  date: string;
  time: string;
  status: string;
  createdAt: string;
};

const STATUS = ["Onay Bekliyor", "Onaylandı", "İptal", "Tamamlandı"] as const;

export default function DoctorAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filter, setFilter] = useState<(typeof STATUS)[number] | "Tümü">("Tümü");

  useEffect(() => {
    const saved = localStorage.getItem("trustdent_appointments");
    if (!saved) return;
    try {
      setAppointments(JSON.parse(saved));
    } catch (e) {
      console.error(e);
    }
  }, []);

  const filtered = useMemo(() => {
    if (filter === "Tümü") return appointments;
    return appointments.filter((a) => a.status === filter);
  }, [appointments, filter]);

  const updateStatus = (id: number, status: string) => {
    setAppointments((prev) => {
      const next = prev.map((a) => (a.id === id ? { ...a, status } : a));
      localStorage.setItem("trustdent_appointments", JSON.stringify(next));
      return next;
    });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Randevular</h1>
      <p className={styles.subtitle}>Gelen talepleri yönetin, durum güncelleyin ve günlük akışı takip edin.</p>

      <div className={styles.listCard}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>Tüm Talepler</h3>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span className={styles.select} style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <Filter size={14} />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                style={{ background: "transparent", border: 0, color: "inherit", outline: "none" }}
              >
                <option value="Tümü">Tümü</option>
                {STATUS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </span>
          </div>
        </div>

        <div className={styles.list}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>Henüz randevu yok.</div>
          ) : (
            filtered.map((apt) => (
              <div key={apt.id} className={styles.listItem}>
                <div className={styles.timeBlock} style={{ width: 68 }}>
                  <div style={{ fontSize: "0.95rem" }}>
                    <Clock size={12} style={{ display: "inline", marginRight: 6 }} />
                    {apt.time}
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 600 }}>{apt.date}</div>
                </div>

                <div className={styles.itemInfo}>
                  <div className={styles.itemName}>{apt.treatment}</div>
                  <div className={styles.itemDesc}>
                    <MapPin size={12} style={{ display: "inline" }} /> {apt.clinic || "Klinik atanmadı"}
                  </div>
                </div>

                <span className={`${styles.statusBadge} ${styles.statusWarning}`}>{apt.status}</span>

                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    className="btn btn-sm btn-ghost"
                    onClick={() => updateStatus(apt.id, "İptal")}
                    style={{ padding: "0.55rem 0.9rem" }}
                  >
                    İptal
                  </button>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => updateStatus(apt.id, "Onaylandı")}
                    style={{ padding: "0.55rem 0.9rem" }}
                  >
                    <CheckCircle2 size={16} />
                    Onayla
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

