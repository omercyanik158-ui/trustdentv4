"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Mail, Phone, Users } from "lucide-react";
import { readDemoAppointments, seedDemoAppointments } from "@/lib/demoAppointments";
import { getAppointmentLabels, normalizeSearchValue } from "@/lib/appointmentLocalization";
import styles from "../Dashboard.module.css";

type Patient = {
  id: string;
  name: string;
  totalAppointments: number;
  lastTreatment: string;
  intakeSummary?: string;
};

export default function DoctorPatientsPage() {
  const locale = useLocale();
  const t = useTranslations("panel.doctor");
  const tTreatments = useTranslations("treatments");
  const searchParams = useSearchParams();
  const searchQuery = normalizeSearchValue(searchParams.get("q") ?? "", locale);
  const [appointments] = useState(() => {
    seedDemoAppointments();
    return readDemoAppointments();
  });

  const latestIntakeByPatient = useMemo(() => {
    const m = new Map<string, string>();
    const withIntake = appointments
      .filter((a) => a.intakeSummary)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    for (const a of withIntake) {
      const name = a.patient || "Patient";
      if (m.has(name)) continue;
      m.set(name, a.intakeSummary!);
    }
    return m;
  }, [appointments]);

  const patients = useMemo<Patient[]>(() => {
    const map = new Map<string, Patient>();
    for (const a of appointments) {
      const labels = getAppointmentLabels(a, locale, (key) => tTreatments(key), t("clinicUnassigned"));
      const name = a.patient || "Patient";
      const existing = map.get(name);
      if (!existing) {
        map.set(name, {
          id: name,
          name,
          totalAppointments: 1,
          lastTreatment: labels.treatmentLabel,
          intakeSummary: latestIntakeByPatient.get(name),
        });
      } else {
        existing.totalAppointments += 1;
        existing.lastTreatment = labels.treatmentLabel;
        existing.intakeSummary = latestIntakeByPatient.get(name) ?? existing.intakeSummary;
      }
    }
    return Array.from(map.values()).filter((patient) => {
      if (!searchQuery) {
        return true;
      }
      return normalizeSearchValue(`${patient.name} ${patient.lastTreatment} ${patient.intakeSummary ?? ""}`, locale).includes(
        searchQuery
      );
    });
  }, [appointments, locale, latestIntakeByPatient, searchQuery, t, tTreatments]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t("myPatientsTitle")}</h1>
      <p className={styles.subtitle}>{t("myPatientsSubtitle")}</p>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={styles.statIcon} style={{ color: "#BC0A18", background: "rgba(188, 10, 24, 0.1)" }}>
              <Users size={20} />
            </div>
          </div>
          <div className={styles.statValue}>{patients.length}</div>
          <div className={styles.statLabel}>{t("totalPatients")}</div>
        </div>
      </div>

      <div className={styles.listCard} style={{ marginTop: "1.25rem" }}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>{t("list")}</h3>
        </div>
        <div className={styles.list}>
          {patients.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
              {t("noPatients")}
            </div>
          ) : (
            patients.map((p) => (
              <div key={p.id} className={styles.listItem}>
                <div className={styles.timeBlock} style={{ width: 62 }}>
                  {p.totalAppointments}
                </div>
                <div className={styles.itemInfo}>
                  <div className={styles.itemName}>{p.name}</div>
                  <div className={styles.itemDesc}>{t("lastProcedure")}: {p.lastTreatment}</div>
                  {p.intakeSummary ? (
                    <div
                      className={styles.itemDesc}
                      style={{
                        marginTop: "0.45rem",
                        padding: "0.55rem 0.7rem",
                        borderRadius: "12px",
                        border: "1px solid var(--border)",
                        background: "var(--bg-subtle)",
                        fontSize: "0.8125rem",
                        lineHeight: 1.45,
                        color: "var(--text-primary)",
                      }}
                    >
                      <span style={{ fontWeight: 800, color: "var(--primary)" }}>{t("patientIntakeSummaryLabel")}: </span>
                      {p.intakeSummary}
                    </div>
                  ) : null}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="btn btn-sm btn-ghost" style={{ padding: "0.55rem 0.9rem" }}>
                    <Phone size={16} /> {t("call")}
                  </button>
                  <button className="btn btn-sm btn-ghost" style={{ padding: "0.55rem 0.9rem" }}>
                    <Mail size={16} /> {t("message")}
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

