"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { MapPin, RefreshCw, XCircle } from "lucide-react";
import {
  readDemoAppointments,
  seedDemoAppointments,
  writeDemoAppointments,
  type AppointmentStatus,
} from "@/lib/demoAppointments";
import { getStatusTone, matchesStatusSearch } from "@/lib/demoStatus";
import { getAppointmentLabels, normalizeSearchValue } from "@/lib/appointmentLocalization";
import styles from "../../doctor/Dashboard.module.css";

export default function PatientAppointmentsPage() {
  const locale = useLocale();
  const t = useTranslations("panel.patient");
  const tTreatments = useTranslations("treatments");
  const searchParams = useSearchParams();
  const searchQuery = normalizeSearchValue(searchParams.get("q") ?? "", locale);
  const [appointments, setAppointments] = useState(() => {
    seedDemoAppointments();
    return readDemoAppointments();
  });

  const statusLabel = useMemo<Record<AppointmentStatus, string>>(
    () => ({
      pending: t("statusPending"),
      inProgress: t("statusInProgress"),
      approved: t("statusApproved"),
      cancelled: t("statusCancelled"),
      completed: t("statusCompleted"),
    }),
    [t]
  );

  const sorted = useMemo(() => {
    return [...appointments]
      .filter((a) => {
        if (!searchQuery) {
          return true;
        }
        const labels = getAppointmentLabels(a, locale, (key) => tTreatments(key), t("clinicUnassigned"));
        const haystack = normalizeSearchValue(
          `${labels.treatmentLabel} ${labels.clinicLabel} ${a.date} ${a.time}`,
          locale
        );
        return haystack.includes(searchQuery) || matchesStatusSearch(a.status, searchQuery, statusLabel, locale);
      })
      .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
  }, [appointments, locale, searchQuery, statusLabel, t, tTreatments]);

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
                {(() => {
                  const labels = getAppointmentLabels(apt, locale, (key) => tTreatments(key), t("clinicUnassigned"));
                  return (
                    <>
                <div className={styles.timeBlock} style={{ width: 70 }}>
                  <div style={{ fontSize: "0.95rem" }}>{labels.dateLabel}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>{apt.time}</div>
                </div>
                <div className={styles.itemInfo}>
                  <div className={styles.itemName}>{labels.treatmentLabel}</div>
                  <div className={styles.itemDesc}>
                    <MapPin size={12} style={{ display: "inline" }} /> {labels.clinicLabel}
                  </div>
                </div>
                <div
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
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  {(() => {
                    const isLocked = apt.status === "cancelled" || apt.status === "completed";
                    return (
                      <>
                  <button
                    className="btn btn-sm btn-ghost"
                    onClick={() => updateStatus(apt.id, "pending")}
                    style={{ padding: "0.55rem 0.9rem" }}
                    disabled={isLocked}
                  >
                    <RefreshCw size={16} /> {t("reschedule")}
                  </button>
                  <button
                    className="btn btn-sm btn-ghost"
                    onClick={() => updateStatus(apt.id, "cancelled")}
                    style={{ padding: "0.55rem 0.9rem" }}
                    disabled={isLocked}
                  >
                    <XCircle size={16} /> {t("cancel")}
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

