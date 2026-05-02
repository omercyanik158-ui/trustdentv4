"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { CheckCircle2, Clock, Filter, MapPin } from "lucide-react";
import {
  readDemoAppointments,
  seedDemoAppointments,
  writeDemoAppointments,
  type AppointmentStatus,
} from "@/lib/demoAppointments";
import { addDemoNotification } from "@/lib/demoNotifications";
import { getStatusTone, matchesStatusSearch } from "@/lib/demoStatus";
import { getAppointmentLabels, normalizeSearchValue } from "@/lib/appointmentLocalization";
import styles from "../Dashboard.module.css";

const STATUS: AppointmentStatus[] = ["pending", "approved", "inProgress", "cancelled", "completed"];

export default function DoctorAppointmentsPage() {
  const locale = useLocale();
  const t = useTranslations("panel.doctor");
  const tTreatments = useTranslations("treatments");
  const searchParams = useSearchParams();
  const searchQuery = normalizeSearchValue(searchParams.get("q") ?? "", locale);
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
      const labels = getAppointmentLabels(a, locale, (key) => tTreatments(key), t("clinicUnassigned"));
      const haystack = normalizeSearchValue(
        `${a.patient} ${labels.treatmentLabel} ${labels.clinicLabel} ${a.date} ${a.time} ${a.intakeSummary ?? ""}`,
        locale
      );
      return haystack.includes(searchQuery) || matchesStatusSearch(a.status, searchQuery, statusLabel, locale);
    });
  }, [appointments, filter, locale, searchQuery, statusLabel, t, tTreatments]);

  const updateStatus = (id: number, status: AppointmentStatus) => {
    setAppointments((prev) => {
      const target = prev.find((item) => item.id === id);
      if (!target || target.status === status) {
        return prev;
      }
      const next = prev.map((a) => (a.id === id ? { ...a, status } : a));
      writeDemoAppointments(next);
      addDemoNotification({
        role: "patient",
        title: t("appointmentStatusChanged"),
        message: `${target.patient} • ${statusLabel[status]}`,
        targetPath: "/patient/appointments",
      });
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
                {(() => {
                  const labels = getAppointmentLabels(apt, locale, (key) => tTreatments(key), t("clinicUnassigned"));
                  return (
                    <>
                <div className={styles.timeBlock} style={{ width: 68 }}>
                  <div style={{ fontSize: "0.95rem" }}>
                    <Clock size={12} style={{ display: "inline", marginRight: 6 }} />
                    {apt.time}
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 600 }}>{labels.dateLabel}</div>
                </div>

                <div className={styles.itemInfo}>
                  <div className={styles.itemDesc}>{apt.patient}</div>
                  <div className={styles.itemName}>{labels.treatmentLabel}</div>
                  <div className={styles.itemDesc}>
                    <MapPin size={12} style={{ display: "inline" }} /> {labels.clinicLabel}
                  </div>
                  {apt.intakeSummary ? <div className={styles.itemDesc}>{apt.intakeSummary}</div> : null}
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
                  {(() => {
                    const disableCancel = apt.status === "cancelled" || apt.status === "completed";
                    const disableApprove = apt.status === "approved" || apt.status === "cancelled" || apt.status === "completed";
                    return (
                      <>
                  <button
                    className="btn btn-sm btn-ghost"
                    onClick={() => updateStatus(apt.id, "cancelled")}
                    style={{ padding: "0.55rem 0.9rem" }}
                    disabled={disableCancel}
                  >
                    {t("cancel")}
                  </button>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => updateStatus(apt.id, "approved")}
                    style={{ padding: "0.55rem 0.9rem" }}
                    disabled={disableApprove}
                  >
                    <CheckCircle2 size={16} />
                    {t("approve")}
                  </button>
                      </>
                    );
                  })()}
                </div>
                    </>
                  );
                })()}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

