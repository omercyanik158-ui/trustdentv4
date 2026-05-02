"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { CheckCircle2, Eye, FileImage } from "lucide-react";
import { formatLocaleDate } from "@/lib/appointmentLocalization";
import {
  isSafeRadiologyPreviewUrl,
  readDemoRadiology,
  seedDemoRadiology,
  writeDemoRadiology,
  type DemoRadiologyRecord,
} from "@/lib/demoRadiology";
import { addDemoNotification } from "@/lib/demoNotifications";
import { sanitizeText } from "@/lib/security";
import styles from "../Dashboard.module.css";

export default function DoctorRadiologyPage() {
  const locale = useLocale();
  const t = useTranslations("panel.doctor");
  const [records, setRecords] = useState(() => {
    seedDemoRadiology();
    return readDemoRadiology();
  });
  const [draftNotes, setDraftNotes] = useState<Record<number, string>>({});

  const sorted = useMemo(() => [...records].sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt)), [records]);

  const saveReview = (id: number) => {
    setRecords((prev) => {
      const note = sanitizeText(draftNotes[id] ?? "", 500);
      const target = prev.find((record) => record.id === id);
      if (!target) {
        return prev;
      }
      const next: DemoRadiologyRecord[] = prev.map((record) =>
        record.id === id
          ? {
              ...record,
              doctorNote: note,
              status: "reviewed" as const,
            }
          : record
      );
      writeDemoRadiology(next);
      addDemoNotification({
        role: "patient",
        title: t("radiologyNotificationPatientTitle"),
        message: note || `${target.title} • ${t("radiologyReviewed")}`,
        targetPath: "/patient/documents",
      });
      return next;
    });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t("radiologyTitle")}</h1>
      <p className={styles.subtitle}>{t("radiologySubtitle")}</p>

      <div className={styles.listCard}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>{t("radiologyList")}</h3>
        </div>

        <div className={styles.list}>
          {sorted.length === 0 ? (
            <div style={{ textAlign: "center", padding: "1.25rem", color: "var(--text-muted)" }}>{t("radiologyNoItems")}</div>
          ) : (
            sorted.map((item) => (
              <div key={item.id} className={styles.listItem} style={{ alignItems: "flex-start" }}>
                <div className={styles.timeBlock} style={{ width: 78 }}>
                  <FileImage size={16} />
                </div>
                <div className={styles.itemInfo} style={{ display: "grid", gap: "0.45rem" }}>
                  <div className={styles.itemName}>
                    {item.patientName} - {item.title}
                  </div>
                  <div className={styles.itemDesc}>
                    {formatLocaleDate(item.uploadedAt, locale)} | {item.fileName}
                  </div>
                  {item.intakeSummary ? (
                    <div
                      style={{
                        padding: "0.65rem 0.85rem",
                        borderRadius: "12px",
                        border: "1px solid color-mix(in srgb, var(--primary) 30%, var(--border))",
                        background: "color-mix(in srgb, var(--primary) 7%, var(--bg-subtle))",
                        fontSize: "0.875rem",
                        lineHeight: 1.45,
                        color: "var(--text-primary)",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: 800,
                          marginBottom: 6,
                          fontSize: "0.68rem",
                          textTransform: "uppercase",
                          letterSpacing: "0.07em",
                          color: "var(--primary)",
                        }}
                      >
                        {t("radiologyBookingContextLabel")}
                      </div>
                      {item.intakeSummary}
                      {item.linkedAppointmentId ? (
                        <Link
                          href={`/${locale}/doctor/appointments?q=${encodeURIComponent(item.patientName)}`}
                          className="btn btn-sm btn-ghost"
                          style={{ marginTop: "0.65rem", width: "fit-content" }}
                        >
                          {t("radiologyLinkedAppointmentCta")}
                        </Link>
                      ) : null}
                    </div>
                  ) : null}
                  {item.notes ? (
                    <div className={styles.itemDesc}>
                      <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>
                        {t("radiologyPatientNotesLabel")}:{" "}
                      </span>
                      {item.notes}
                    </div>
                  ) : null}
                  <textarea
                    className="input"
                    value={draftNotes[item.id] ?? item.doctorNote}
                    onChange={(e) =>
                      setDraftNotes((prev) => ({
                        ...prev,
                        [item.id]: sanitizeText(e.target.value, 500),
                      }))
                    }
                    placeholder={t("radiologyDoctorNotePlaceholder")}
                    style={{ minHeight: 72, resize: "vertical" }}
                  />
                </div>
                <div style={{ display: "grid", gap: "0.5rem" }}>
                  {isSafeRadiologyPreviewUrl(item.previewDataUrl) ? (
                    <a className="btn btn-sm btn-ghost" href={item.previewDataUrl} target="_blank" rel="noreferrer">
                      <Eye size={16} /> {t("radiologyView")}
                    </a>
                  ) : (
                    <span className={styles.itemDesc}>{t("radiologyPreviewInvalid")}</span>
                  )}
                  <button className="btn btn-sm btn-primary" onClick={() => saveReview(item.id)}>
                    <CheckCircle2 size={16} /> {t("radiologyMarkReviewed")}
                  </button>
                  <span
                    className={styles.statusBadge}
                    style={{
                      justifyContent: "center",
                      background: item.status === "reviewed" ? "rgba(34,197,94,.12)" : "rgba(245,158,11,.12)",
                      color: item.status === "reviewed" ? "#22c55e" : "#f59e0b",
                    }}
                  >
                    {item.status === "reviewed" ? t("radiologyReviewed") : t("radiologyPending")}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
