"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Eye, FileUp, Info, Upload } from "lucide-react";
import {
  createRadiologyRecord,
  isSafeRadiologyPreviewUrl,
  readDemoRadiology,
  seedDemoRadiology,
  writeDemoRadiology,
} from "@/lib/demoRadiology";
import { DEMO_PATIENT_RECORD_ID } from "@/lib/demo/demoPatient";
import { demoPatientCareReadModel, radiologyFieldsFromIntakeSnapshot } from "@/lib/patientCare";
import { addDemoNotification } from "@/lib/demoNotifications";
import { sanitizeText } from "@/lib/security";
import { formatLocaleDate } from "@/lib/appointmentLocalization";
import styles from "../../doctor/Dashboard.module.css";

const MAX_FILE_MB = 6;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAGIC_SIGNATURES: Record<string, number[][]> = {
  "image/jpeg": [[0xff, 0xd8, 0xff]],
  "image/png": [[0x89, 0x50, 0x4e, 0x47]],
  "image/webp": [[0x52, 0x49, 0x46, 0x46]],
};

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("file-read-failed"));
    reader.readAsDataURL(file);
  });
}

async function hasValidImageSignature(file: File): Promise<boolean> {
  const signatures = MAGIC_SIGNATURES[file.type];
  if (!signatures) return false;
  const header = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  return signatures.some((sig) => sig.every((byte, index) => header[index] === byte));
}

export default function PatientDocumentsPage() {
  const locale = useLocale();
  const t = useTranslations("panel.patient");
  const tHeader = useTranslations("panel.header");
  const [records, setRecords] = useState(() => {
    seedDemoRadiology();
    return readDemoRadiology();
  });
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const visible = useMemo(
    () =>
      records
        .filter((record) => record.patientId === DEMO_PATIENT_RECORD_ID)
        .sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt)),
    [records]
  );

  const demoPatientName = tHeader("demoPatientName");
  const bookingSnapshot = useMemo(
    () =>
      demoPatientCareReadModel.getLatestAppointmentIntakeSnapshot({
        patientRecordId: DEMO_PATIENT_RECORD_ID,
        patientDisplayName: demoPatientName,
      }),
    [demoPatientName]
  );

  const onUploadFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setSuccess(null);

    if (!ALLOWED_TYPES.has(file.type)) {
      setError(t("documentsFileTypeError"));
      return;
    }
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      setError(t("documentsFileSizeError", { size: MAX_FILE_MB }));
      return;
    }
    if (!(await hasValidImageSignature(file))) {
      setError(t("documentsFileTypeError"));
      return;
    }

    setUploading(true);
    try {
      const previewDataUrl = await fileToDataUrl(file);
      const snapshot = demoPatientCareReadModel.getLatestAppointmentIntakeSnapshot({
        patientRecordId: DEMO_PATIENT_RECORD_ID,
        patientDisplayName: demoPatientName,
      });
      const intakeLink = radiologyFieldsFromIntakeSnapshot(snapshot);
      const nextRecord = createRadiologyRecord({
        patientId: DEMO_PATIENT_RECORD_ID,
        patientName: demoPatientName,
        title: sanitizeText(title || t("documentsDefaultTitle"), 120),
        notes: sanitizeText(notes, 400),
        ...intakeLink,
        fileName: file.name,
        mimeType: file.type,
        sizeKb: Math.round(file.size / 1024),
        previewDataUrl,
      });
      const next = [nextRecord, ...records];
      writeDemoRadiology(next);
      setRecords(next);
      const notifyBits = [
        nextRecord.title,
        snapshot?.intakeSummary ? sanitizeText(snapshot.intakeSummary.slice(0, 140), 140) : "",
      ].filter(Boolean);
      addDemoNotification({
        role: "doctor",
        title: t("documentsNotificationDoctorTitle"),
        message: `${demoPatientName} • ${notifyBits.join(" · ")}`,
        targetPath: "/doctor/radiology",
      });
      setTitle("");
      setNotes("");
      setSuccess(t("documentsUploadSuccess"));
    } catch {
      setError(t("documentsUploadFailed"));
    } finally {
      setUploading(false);
      event.currentTarget.value = "";
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t("documentsTitle")}</h1>
      <p className={styles.subtitle}>{t("documentsSubtitle")}</p>

      <div className={styles.listCard}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>{t("documentsUploadCardTitle")}</h3>
        </div>

        <div style={{ display: "grid", gap: "0.8rem" }}>
          {bookingSnapshot ? (
            <div
              style={{
                display: "flex",
                gap: "0.65rem",
                padding: "0.75rem 0.9rem",
                borderRadius: "14px",
                border: "1px solid color-mix(in srgb, var(--primary) 28%, var(--border))",
                background: "color-mix(in srgb, var(--primary) 6%, var(--bg-subtle))",
                fontSize: "0.875rem",
                lineHeight: 1.45,
                color: "var(--text-secondary)",
              }}
            >
              <Info size={18} style={{ flexShrink: 0, marginTop: 2, color: "var(--primary)" }} aria-hidden />
              <div style={{ display: "grid", gap: "0.35rem" }}>
                <span style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "0.8125rem" }}>
                  {bookingSnapshot.intakeSummary
                    ? t("documentsIntakeSnapshotTitle")
                    : t("documentsIntakeSnapshotEmpty")}
                </span>
                {bookingSnapshot.intakeSummary ? (
                  <span style={{ color: "var(--text-primary)" }}>{bookingSnapshot.intakeSummary}</span>
                ) : null}
              </div>
            </div>
          ) : null}
          <label htmlFor="document-title" className={styles.itemDesc}>{t("documentsTitleLabel")}</label>
          <input
            id="document-title"
            className="input"
            value={title}
            onChange={(e) => setTitle(sanitizeText(e.target.value, 120))}
            placeholder={t("documentsTitleLabel")}
          />
          <label htmlFor="document-notes" className={styles.itemDesc}>{t("documentsNotesLabel")}</label>
          <textarea
            id="document-notes"
            className="input"
            value={notes}
            onChange={(e) => setNotes(sanitizeText(e.target.value, 400))}
            placeholder={t("documentsNotesLabel")}
            style={{ minHeight: 92, resize: "vertical" }}
          />
          <label className="btn btn-primary" style={{ width: "fit-content", cursor: uploading ? "default" : "pointer" }}>
            <Upload size={16} /> {uploading ? t("documentsUploading") : t("documentsSelectFile")}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={onUploadFile}
              disabled={uploading}
              aria-label={t("documentsSelectFile")}
              style={{ display: "none" }}
            />
          </label>
          <div style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>{t("documentsUploadHint", { size: MAX_FILE_MB })}</div>
          {error ? <div style={{ color: "#ef4444", fontSize: "0.85rem" }}>{error}</div> : null}
          {success ? <div style={{ color: "#22c55e", fontSize: "0.85rem" }}>{success}</div> : null}
        </div>
      </div>

      <div className={styles.listCard} style={{ marginTop: "1rem" }}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>{t("documentsListTitle")}</h3>
        </div>
        <div className={styles.list}>
          {visible.length === 0 ? (
            <div style={{ textAlign: "center", padding: "1.25rem", color: "var(--text-muted)" }}>{t("documentsNoItems")}</div>
          ) : (
            visible.map((item) => (
              <div key={item.id} className={styles.listItem}>
                <div className={styles.timeBlock} style={{ width: 78 }}>
                  <FileUp size={16} />
                </div>
                <div className={styles.itemInfo}>
                  <div className={styles.itemName}>{item.title}</div>
                  <div className={styles.itemDesc}>
                    {t("documentsUploadedAt")}: {formatLocaleDate(item.uploadedAt, locale)}
                  </div>
                  <div className={styles.itemDesc}>
                    {item.fileName} ({item.sizeKb} KB)
                  </div>
                  {item.intakeSummary ? (
                    <div className={styles.itemDesc} style={{ color: "var(--text-primary)" }}>
                      <strong>{t("documentsListIntakeLabel")}: </strong>
                      {item.intakeSummary}
                    </div>
                  ) : null}
                  {item.notes ? <div className={styles.itemDesc}>{item.notes}</div> : null}
                  {item.doctorNote ? (
                    <div className={styles.itemDesc} style={{ color: "var(--text-primary)" }}>
                      {t("documentsDoctorNote")}: {item.doctorNote}
                    </div>
                  ) : null}
                </div>
                {isSafeRadiologyPreviewUrl(item.previewDataUrl) ? (
                  <a className="btn btn-sm btn-ghost" href={item.previewDataUrl} target="_blank" rel="noreferrer">
                    <Eye size={16} /> {t("documentsView")}
                  </a>
                ) : (
                  <span className={styles.itemDesc}>{t("documentsPreviewInvalid")}</span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
