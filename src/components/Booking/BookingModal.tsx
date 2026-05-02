"use client";

import { useEffect, useMemo, useState } from "react";
import { X, MapPin, CheckCircle2, User, Phone, Clock } from "lucide-react";
import styles from "./BookingModal.module.css";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import CalendarPopover from "./CalendarPopover";
import {
  readDemoAppointments,
  seedDemoAppointments,
  writeDemoAppointments,
  type DemoAppointment,
} from "@/lib/demoAppointments";
import { sanitizePhone, sanitizeText } from "@/lib/security";
import { trackEvent } from "@/lib/observability";
import { CLINICS } from "@/data/clinics";
import type { TreatmentId } from "@/data/types";
import { addDemoNotifications } from "@/lib/demoNotifications";

type BookingModalProps = {
  isOpen: boolean;
  onClose: () => void;
  locale: string;
  /**
   * Logged-in patient / EMR id. When set, links the booking to stable patient rows
   * (intake ↔ radiology resolution). Public marketing booking flows omit this.
   */
  patientRecordId?: string | null;
};

const TIME_OPTIONS = ["09:00", "10:30", "13:00", "14:30", "16:00"];

export default function BookingModal({ isOpen, onClose, locale, patientRecordId }: BookingModalProps) {
  const router = useRouter();
  const t = useTranslations("booking");
  const tTreatments = useTranslations("treatments");
  const [step, setStep] = useState(1);
  const [surveyConcern, setSurveyConcern] = useState("pain");
  const [surveyPain, setSurveyPain] = useState(4);
  const [surveyPriority, setSurveyPriority] = useState("speed");
  const [treatment, setTreatment] = useState("");
  const [clinic, setClinic] = useState("auto");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  
  // Mock User
  const [name, setName] = useState("Ahmet Yılmaz");
  const [phone, setPhone] = useState("+90 555 123 4567");

  const resetForm = () => {
    setStep(1);
    setSurveyConcern("pain");
    setSurveyPain(4);
    setSurveyPriority("speed");
    setTreatment("");
    setClinic("auto");
    setDate("");
    setTime("");
  };

  const closeModal = () => {
    resetForm();
    onClose();
  };

  const treatmentOptions = useMemo(
    () => [
      { id: "implants", label: tTreatments("implants.title") },
      { id: "zirconia", label: tTreatments("zirconia.title") },
      { id: "whitening", label: tTreatments("whitening.title") },
      { id: "root-canal", label: tTreatments("root-canal.title") },
    ],
    [tTreatments]
  );

  const clinicOptions = useMemo(
    () => [
      { id: "auto", label: t("clinicBestMatch"), slug: null as string | null },
      ...CLINICS.slice(0, 3).map((clinic) => ({ id: clinic.slug, label: clinic.name, slug: clinic.slug })),
    ],
    [t]
  );

  const selectedTreatmentLabel =
    treatmentOptions.find((item) => item.id === treatment)?.label ?? treatment;
  const selectedClinic = clinicOptions.find((item) => item.id === clinic);
  const selectedClinicLabel = selectedClinic?.label ?? t("clinicBestMatch");

  const recommendation = useMemo(() => {
    let id: TreatmentId = "implants";
    if (surveyConcern === "pain" && surveyPain >= 7) id = "root-canal";
    else if (surveyConcern === "missing") id = "implants";
    else if (surveyConcern === "color") id = "whitening";
    else if (surveyConcern === "shape") id = "zirconia";
    return {
      id,
      label: tTreatments(`${id}.title`),
    };
  }, [surveyConcern, surveyPain, tTreatments]);

  const intakeSummary = useMemo(() => {
    return sanitizeText(
      `${t("intakeSummaryPrefix")}: ${t(`intakeConcern_${surveyConcern}`)}, ${t("intakePainLabel")} ${surveyPain}/10, ${t(
        `intakePriority_${surveyPriority}`
      )}. ${t("intakeSuggestedTreatment")}: ${recommendation.label}`,
      260
    );
  }, [recommendation.label, surveyConcern, surveyPain, surveyPriority, t]);

  const goNextFromIntake = () => {
    if (!treatment) {
      setTreatment(recommendation.id);
    }
    setStep(2);
  };

  const handleComplete = () => {
    seedDemoAppointments();
    // Save to localStorage to simulate DB
    const safeName = sanitizeText(name, 80);
    const newAppointment: DemoAppointment = {
      id: Date.now(),
      patientRecordId: patientRecordId ?? undefined,
      patient: safeName,
      treatmentId: (treatment as TreatmentId) || "implants",
      clinicSlug: selectedClinic?.slug ?? null,
      treatment: sanitizeText(selectedTreatmentLabel, 120),
      clinic: sanitizeText(selectedClinicLabel, 120),
      date,
      time,
      intakeSummary,
      status: "pending",
      createdAt: new Date().toISOString()
    };
    
    const existing = readDemoAppointments();
    writeDemoAppointments([newAppointment, ...existing]);
    addDemoNotifications([
      {
        role: "patient",
        title: t("notificationPatientTitle"),
        message: t("notificationPatientMessage"),
        targetPath: "/patient/appointments",
      },
      {
        role: "doctor",
        title: t("notificationDoctorTitle"),
        message: `${safeName} • ${sanitizeText(selectedTreatmentLabel, 80)}`,
        targetPath: "/doctor/appointments",
      },
    ]);
    trackEvent("booking_created", {
      locale,
      treatment: newAppointment.treatment,
      hasClinic: Boolean(newAppointment.clinic && newAppointment.clinic !== t("clinicBestMatch")),
    });
    
    setStep(5); // Success step
  };

  const handleGoToDashboard = () => {
    trackEvent("booking_success_navigate_dashboard", { locale });
    resetForm();
    onClose();
    router.push(`/${locale}/patient`);
  };

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={closeModal}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={closeModal}><X size={20} /></button>

        <div className={styles.header}>
          <h2 className={styles.title}>{t("title")}</h2>
          <div className={styles.progress}>
            <div className={styles.progressTrack}>
              <div className={styles.progressFill} style={{ width: `${(step / 5) * 100}%` }} />
            </div>
            <div className={styles.stepText}>{t("step", { current: step, total: 5 })}</div>
          </div>
        </div>

        <div className={styles.body}>
          {/* STEP 1: Quick Intake */}
          {step === 1 && (
            <div className={styles.stepContainer}>
              <h3 className={styles.stepTitle}>{t("intakeTitle")}</h3>
              <p className={styles.stepDesc}>{t("intakeDesc")}</p>

              <div className={styles.formGroup}>
                <label>{t("intakeConcernLabel")}</label>
                <select className="input" value={surveyConcern} onChange={(e) => setSurveyConcern(e.target.value)}>
                  <option value="pain">{t("intakeConcern_pain")}</option>
                  <option value="missing">{t("intakeConcern_missing")}</option>
                  <option value="color">{t("intakeConcern_color")}</option>
                  <option value="shape">{t("intakeConcern_shape")}</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>{t("intakePainLabel")}: {surveyPain}/10</label>
                <input
                  type="range"
                  min={0}
                  max={10}
                  value={surveyPain}
                  onChange={(e) => setSurveyPain(Number(e.target.value))}
                />
              </div>

              <div className={styles.formGroup}>
                <label>{t("intakePriorityLabel")}</label>
                <select className="input" value={surveyPriority} onChange={(e) => setSurveyPriority(e.target.value)}>
                  <option value="speed">{t("intakePriority_speed")}</option>
                  <option value="price">{t("intakePriority_price")}</option>
                  <option value="aesthetics">{t("intakePriority_aesthetics")}</option>
                </select>
              </div>

              <div className={styles.summaryBox}>
                <div className={styles.summaryItem}><strong>{t("intakeSuggestedTreatment")}:</strong> {recommendation.label}</div>
                <div className={styles.summaryItem}>{t("intakeDisclaimer")}</div>
              </div>

              <div className={styles.actions}>
                <button className="btn btn-ghost" onClick={goNextFromIntake}>{t("skipQuickIntake")}</button>
                <button className="btn btn-primary" onClick={goNextFromIntake}>{t("continue")}</button>
              </div>
            </div>
          )}

          {/* STEP 2: Treatment & Clinic */}
          {step === 2 && (
            <div className={styles.stepContainer}>
              <h3 className={styles.stepTitle}>{t("step1Title")}</h3>
              <p className={styles.stepDesc}>{t("step1Desc")}</p>
              
              <div className={styles.formGroup}>
                <label>{t("treatmentLabel")}</label>
                <select className="input" value={treatment} onChange={(e) => setTreatment(e.target.value)}>
                  <option value="">{t("choose")}</option>
                  {treatmentOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>{t("clinicLabel")}</label>
                <select className="input" value={clinic} onChange={(e) => setClinic(e.target.value)}>
                  {clinicOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <button 
                className="btn btn-primary" 
                style={{ width: "100%", marginTop: "1rem" }}
                disabled={!treatment}
                onClick={() => setStep(3)}
              >
                {t("continue")}
              </button>
            </div>
          )}

          {/* STEP 3: Date & Time */}
          {step === 3 && (
            <div className={styles.stepContainer}>
              <h3 className={styles.stepTitle}>{t("step2Title")}</h3>
              <p className={styles.stepDesc}>{t("step2Desc")}</p>
              
              <div className={styles.formGroup}>
                <label>{t("dateLabel")}</label>
                <CalendarPopover locale={locale} value={date} onChange={setDate} label={t("selectDate")} />
              </div>

              <div className={styles.formGroup}>
                <label>{t("timeLabel")}</label>
                <div className={styles.timeGrid}>
                  {TIME_OPTIONS.map((slot) => (
                    <button 
                      key={slot}
                      className={`${styles.timeSlot} ${time === slot ? styles.timeSelected : ""}`}
                      onClick={() => setTime(slot)}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.actions}>
                <button className="btn btn-ghost" onClick={() => setStep(2)}>{t("back")}</button>
                <button 
                  className="btn btn-primary" 
                  disabled={!date || !time}
                  onClick={() => setStep(4)}
                >
                  {t("continue")}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Contact Info */}
          {step === 4 && (
            <div className={styles.stepContainer}>
              <h3 className={styles.stepTitle}>{t("step3Title")}</h3>
              <p className={styles.stepDesc}>{t("step3Desc")}</p>
              
              <div className={styles.formGroup}>
                <label><User size={14} style={{ display: "inline", marginRight: 4 }}/>{t("fullNameLabel")}</label>
                <input
                  type="text"
                  className="input"
                  value={name}
                  onChange={(e) => setName(sanitizeText(e.target.value, 80))}
                />
              </div>

              <div className={styles.formGroup}>
                <label><Phone size={14} style={{ display: "inline", marginRight: 4 }}/>{t("phoneLabel")}</label>
                <input
                  type="tel"
                  className="input"
                  value={phone}
                  onChange={(e) => setPhone(sanitizePhone(e.target.value))}
                />
              </div>

              <div className={styles.summaryBox}>
                <div className={styles.summaryItem}><MapPin size={14}/> {selectedClinicLabel}</div>
                <div className={styles.summaryItem}><Clock size={14}/> {date} - {time}</div>
                <div className={styles.summaryItem}><strong>{selectedTreatmentLabel}</strong></div>
                <div className={styles.summaryItem}>{intakeSummary}</div>
              </div>

              <div className={styles.actions}>
                <button className="btn btn-ghost" onClick={() => setStep(3)}>{t("back")}</button>
                <button className="btn btn-primary" onClick={handleComplete}>
                  {t("confirmAppointment")}
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Success */}
          {step === 5 && (
            <div className={styles.successState}>
              <div className={styles.successIcon}>
                <CheckCircle2 size={48} />
              </div>
              <h3 className={styles.successTitle}>{t("successTitle")}</h3>
              <p className={styles.successDesc}>
                {t("successDesc")}
              </p>
              <button className="btn btn-primary" onClick={handleGoToDashboard} style={{ width: "100%" }}>
                {t("goToPatientPanel")}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
