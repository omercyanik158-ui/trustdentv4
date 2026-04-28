"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
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

export default function PatientAppointmentsPage() {
  const t = useTranslations("panel.patient");
  const [appointments, setAppointments] = useState<Appointment[]>(readAppointmentsFromStorage);

  const statusLabel: Record<string, string> = {
    "Onay Bekliyor": t("statusPending"),
    Onaylandı: t("statusApproved"),
    İptal: t("statusCancelled"),
    Tamamlandı: t("statusCompleted"),
  };

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
      <h1 className={styles.title}>{t("appointmentsTitle")}</h1>
      <p className={styles.subtitle}>{t("appointmentsSubtitle")}</p>

      <div className={styles.listCard} style={{ gridColumn: "1 / -1" }}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>{t("list")}</h3>
        </div>

        <div className={styles.list}>
          {sorted.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
              {t("noAppointments")}
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
                    <MapPin size={12} style={{ display: "inline" }} /> {apt.clinic || t("clinicUnassigned")}
                  </div>
                </div>
                <div className={`${styles.statusBadge} ${styles.statusWarning}`}>
                  {statusLabel[apt.status] ?? apt.status}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    className="btn btn-sm btn-ghost"
                    onClick={() => updateStatus(apt.id, "Onay Bekliyor")}
                    style={{ padding: "0.55rem 0.9rem" }}
                  >
                    <RefreshCw size={16} /> {t("reschedule")}
                  </button>
                  <button
                    className="btn btn-sm btn-ghost"
                    onClick={() => updateStatus(apt.id, "İptal")}
                    style={{ padding: "0.55rem 0.9rem" }}
                  >
                    <XCircle size={16} /> {t("cancel")}
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

