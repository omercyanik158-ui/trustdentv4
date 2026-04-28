"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { CheckCircle2, Clock, Filter, MapPin } from "lucide-react";
import {
  readDemoAppointments,
  seedDemoAppointments,
  writeDemoAppointments,
  type AppointmentStatus,
} from "@/lib/demoAppointments";
import { getStatusTone, matchesStatusSearch } from "@/lib/demoStatus";
import styles from "../Dashboard.module.css";

const STATUS: AppointmentStatus[] = ["pending", "approved", "inProgress", "cancelled", "completed"];

export default function DoctorAppointmentsPage() {
  const t = useTranslations("panel.doctor");
  const searchParams = useSearchParams();
  const searchQuery = (searchParams.get("q") ?? "").trim().toLowerCase();
  const [appointments, setAppointments] = useState(() => {
    seedDemoAppointments();
    return readDemoAppointments();
  });
  const [filter, setFilter] = useState<AppointmentStatus | "all">("all");

  const statusLabel = useMemo<Record<AppointmentStatus, string>>(
    () => ({
      pending: t("statusPending"),
      approved: t("statusApproved"),
      inProgress: t("statusInProgress"),
      cancelled: t("statusCancelled"),
      completed: t("statusCompleted"),
    }),
    [t]
  );

  const filtered = useMemo(() => {
    const byFilter = filter === "all" ? appointments : appointments.filter((a) => a.status === filter);
    if (!searchQuery) {
      return byFilter;
    }
    return byFilter.filter((a) => {
      const haystack = `${a.patient} ${a.treatment} ${a.clinic} ${a.date} ${a.time}`.toLowerCase();
      return haystack.includes(searchQuery) || matchesStatusSearch(a.status, searchQuery, statusLabel);
    });
  }, [appointments, filter, searchQuery, statusLabel]);

  const updateStatus = (id: number, status: AppointmentStatus) => {
    setAppointments((prev) => {
      const next = prev.map((a) => (a.id === id ? { ...a, status } : a));
      writeDemoAppointments(next);
      return next;
    });
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
                onChange={(e) => setFilter(e.target.value as AppointmentStatus | "all")}
                style={{ background: "transparent", border: 0, color: "inherit", outline: "none" }}
              >
                <option value="all">{t("viewAll")}</option>
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
                  <div className={styles.itemDesc}>{apt.patient}</div>
                  <div className={styles.itemName}>{apt.treatment}</div>
                  <div className={styles.itemDesc}>
                    <MapPin size={12} style={{ display: "inline" }} /> {apt.clinic || t("clinicUnassigned")}
                  </div>
                </div>

                <span
                  className={`${styles.statusBadge} ${
                    getStatusTone(apt.status) === "warning"
                      ? styles.statusWarning
                      : getStatusTone(apt.status) === "primary"
                        ? styles.statusPrimary
                        : getStatusTone(apt.status) === "danger"
                          ? styles.statusDanger
                          : styles.statusSuccess
                  }`}
                >
                  {statusLabel[apt.status]}
                </span>

                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    className="btn btn-sm btn-ghost"
                    onClick={() => updateStatus(apt.id, "cancelled")}
                    style={{ padding: "0.55rem 0.9rem" }}
                  >
                    {t("cancel")}
                  </button>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => updateStatus(apt.id, "approved")}
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

