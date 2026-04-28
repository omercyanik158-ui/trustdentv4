"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
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

function readAppointmentsFromStorage(): Appointment[] {
  if (typeof window === "undefined") return [];
  const saved = localStorage.getItem("trustdent_appointments");
  if (!saved) return [];
  try {
    return JSON.parse(saved) as Appointment[];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default function DoctorAppointmentsPage() {
  const t = useTranslations("panel.doctor");
  const [appointments, setAppointments] = useState<Appointment[]>(readAppointmentsFromStorage);
  const [filter, setFilter] = useState<(typeof STATUS)[number] | "Tümü">("Tümü");

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

  const statusLabel: Record<(typeof STATUS)[number], string> = {
    "Onay Bekliyor": t("statusPending"),
    Onaylandı: t("statusApproved"),
    İptal: t("statusCancelled"),
    Tamamlandı: t("statusCompleted"),
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t("appointmentsTitle")}</h1>
      <p className={styles.subtitle}>{t("appointmentsSubtitle")}</p>

      <div className={styles.listCard}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>{t("allRequests")}</h3>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span className={styles.select} style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <Filter size={14} />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as (typeof STATUS)[number] | "Tümü")}
                style={{ background: "transparent", border: 0, color: "inherit", outline: "none" }}
              >
                <option value="Tümü">{t("viewAll")}</option>
                {STATUS.map((s) => (
                  <option key={s} value={s}>
                    {statusLabel[s]}
                  </option>
                ))}
              </select>
            </span>
          </div>
        </div>

        <div className={styles.list}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>{t("noAppointmentsYet")}</div>
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
                    <MapPin size={12} style={{ display: "inline" }} /> {apt.clinic || t("clinicUnassigned")}
                  </div>
                </div>

                <span className={`${styles.statusBadge} ${styles.statusWarning}`}>{statusLabel[apt.status as (typeof STATUS)[number]] ?? apt.status}</span>

                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    className="btn btn-sm btn-ghost"
                    onClick={() => updateStatus(apt.id, "İptal")}
                    style={{ padding: "0.55rem 0.9rem" }}
                  >
                    {t("cancel")}
                  </button>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => updateStatus(apt.id, "Onaylandı")}
                    style={{ padding: "0.55rem 0.9rem" }}
                  >
                    <CheckCircle2 size={16} />
                    {t("approve")}
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

